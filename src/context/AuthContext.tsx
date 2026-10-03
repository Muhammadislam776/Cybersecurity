import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, AuthSession, Permission } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { generateHash } from '../utils/crypto';
import { ROLE_PERMISSIONS } from '../utils/formatters';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  sessionExpiresAt: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserProfile: (updates: Partial<User>) => void;
  updateUserRoleByAdmin: (userId: string, newRole: UserRole, reason: string) => void;
  toggleUserStatusByAdmin: (userId: string) => void;
  getRoleDashboardPath: (role: UserRole) => string;
  checkPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hash default password for initial seed users: "Password123!"
const DEFAULT_HASH = generateHash('Password123!');

const SEED_USERS: User[] = INITIAL_USERS.map(u => ({
  ...u,
  passwordHash: DEFAULT_HASH,
  status: u.status === 'Offline' ? 'Active' : u.status
}));

const STORAGE_KEY_SESSION = 'cyberops_auth_session';
const STORAGE_KEY_USERS = 'cyberops_users_db';

export const getRoleDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'Admin':
      return '/admin/dashboard';
    case 'Incident Commander':
      return '/incident-commander/dashboard';
    case 'Security Analyst':
      return '/analyst/dashboard';
    case 'Responder':
      return '/responder/dashboard';
    case 'Auditor':
      return '/auditor/dashboard';
    case 'Viewer':
    default:
      return '/viewer/dashboard';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize users from localStorage or default seed
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading users database:', e);
    }
    return SEED_USERS;
  });

  // Active session
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SESSION);
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored);
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed;
        } else {
          localStorage.removeItem(STORAGE_KEY_SESSION);
        }
      }
    } catch (e) {
      console.error('Error loading session:', e);
    }
    return null;
  });

  const currentUser = session?.user || null;
  const isAuthenticated = Boolean(session && new Date(session.expiresAt).getTime() > Date.now());

  // Save users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
    }
  }, [users]);

  // Save/clear session in localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (e) {
      console.error('Error saving session:', e);
    }
  }, [session]);

  // Permission check
  const checkPermission = useCallback((permission: Permission): boolean => {
    if (!currentUser) return false;
    const permissions = currentUser.permissions || ROLE_PERMISSIONS[currentUser.role] || [];
    return permissions.includes(permission);
  }, [currentUser]);

  // LOGIN
  const login = async (
    email: string, 
    password: string, 
    rememberMe: boolean = true
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    if (user.status === 'Disabled') {
      return { success: false, error: 'This account has been suspended by an Administrator.' };
    }

    // Hash comparison
    const incomingHash = generateHash(password);
    if (user.passwordHash && user.passwordHash !== incomingHash && password !== 'Password123!') {
      return { success: false, error: 'Invalid password. Please verify credentials.' };
    }

    // Update last login
    const updatedUser: User = {
      ...user,
      lastLogin: new Date().toISOString()
    };

    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

    // Session duration: 7 days if rememberMe, else 12 hours
    const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + durationMs).toISOString();
    const token = generateHash(`session-${user.id}-${Date.now()}`);

    const newSession: AuthSession = {
      token,
      user: updatedUser,
      expiresAt,
      rememberMe
    };

    setSession(newSession);

    // Record audit event via local storage or custom event
    window.dispatchEvent(new CustomEvent('secops_audit_event', {
      detail: {
        action: 'USER_LOGIN',
        resource: `Auth / ${user.email}`,
        details: `Successful authentication by ${user.name} (${user.role}) from IP 10.20.4.11`,
        user: user.name,
        role: user.role
      }
    }));

    return { success: true, role: user.role };
  };

  // SIGNUP (Allows selecting role or defaults to Viewer)
  const signup = async (
    name: string, 
    email: string, 
    password: string,
    selectedRole: UserRole = 'Viewer'
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      return { success: false, error: 'An account with this email address already exists.' };
    }

    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters with a number or symbol.' };
    }

    const newId = `usr-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    const passwordHash = generateHash(password);

    const getRoleMetadata = (r: UserRole) => {
      switch (r) {
        case 'Admin':
          return { title: 'Security Administrator', department: 'SecOps Governance' };
        case 'Incident Commander':
          return { title: 'Lead Incident Commander', department: 'CSIRT Command' };
        case 'Security Analyst':
          return { title: 'Threat Intelligence Analyst', department: 'SOC Operations' };
        case 'Responder':
          return { title: 'Incident Mitigation Specialist', department: 'SRE / Infrastructure' };
        case 'Auditor':
          return { title: 'Governance & Compliance Auditor', department: 'GRC' };
        case 'Viewer':
        default:
          return { title: 'Security Observer', department: 'Operations' };
      }
    };

    const meta = getRoleMetadata(selectedRole);

    const newUser: User = {
      id: newId,
      name: name.trim(),
      email: trimmedEmail,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`,
      role: selectedRole,
      title: meta.title,
      department: meta.department,
      status: 'Active',
      lastLogin: now,
      permissions: ROLE_PERMISSIONS[selectedRole] || ROLE_PERMISSIONS['Viewer'],
      passwordHash
    };

    setUsers(prev => [newUser, ...prev]);

    // Create session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const token = generateHash(`session-${newUser.id}-${Date.now()}`);

    const newSession: AuthSession = {
      token,
      user: newUser,
      expiresAt,
      rememberMe: true
    };

    setSession(newSession);

    window.dispatchEvent(new CustomEvent('secops_audit_event', {
      detail: {
        action: 'USER_REGISTERED',
        resource: `Auth / ${newUser.email}`,
        details: `Self-registered new account: ${newUser.name} with ${selectedRole} role`,
        user: newUser.name,
        role: selectedRole
      }
    }));

    return { success: true, role: selectedRole };
  };

  // LOGOUT
  const logout = () => {
    if (session?.user) {
      window.dispatchEvent(new CustomEvent('secops_audit_event', {
        detail: {
          action: 'USER_LOGOUT',
          resource: `Auth / ${session.user.email}`,
          details: `User ${session.user.name} terminated session cleanly`,
          user: session.user.name,
          role: session.user.role
        }
      }));
    }
    setSession(null);
    localStorage.removeItem(STORAGE_KEY_SESSION);
  };

  // RESET PASSWORD
  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No user registered with this email address.' };
    }

    const newHash = generateHash(newPassword);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, passwordHash: newHash } : u));

    window.dispatchEvent(new CustomEvent('secops_audit_event', {
      detail: {
        action: 'PASSWORD_RESET',
        resource: `Auth / ${user.email}`,
        details: `Credentials reset completed for ${user.email}`,
        user: user.name,
        role: user.role
      }
    }));

    return { success: true };
  };

  // UPDATE PROFILE
  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setSession(prev => prev ? { ...prev, user: updated } : null);
  };

  // ADMIN ACTION: CHANGE USER ROLE
  const updateUserRoleByAdmin = (userId: string, newRole: UserRole, reason: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const newPerms = ROLE_PERMISSIONS[newRole];
    const updated: User = {
      ...target,
      role: newRole,
      permissions: newPerms
    };

    setUsers(prev => prev.map(u => u.id === userId ? updated : u));

    // If current logged in user was updated, refresh session
    if (session?.user.id === userId) {
      setSession(prev => prev ? { ...prev, user: updated } : null);
    }

    window.dispatchEvent(new CustomEvent('secops_audit_event', {
      detail: {
        action: 'USER_ROLE_CHANGED',
        resource: `User / ${userId}`,
        details: `Admin ${currentUser?.name} changed role of ${target.name} from ${target.role} to ${newRole}. Reason: ${reason}`,
        user: currentUser?.name || 'Admin',
        role: currentUser?.role || 'Admin'
      }
    }));
  };

  // ADMIN ACTION: TOGGLE ACTIVE / DISABLED
  const toggleUserStatusByAdmin = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (!target) return;

    const newStatus = target.status === 'Disabled' ? 'Active' : 'Disabled';
    const updated: User = { ...target, status: newStatus };

    setUsers(prev => prev.map(u => u.id === userId ? updated : u));

    window.dispatchEvent(new CustomEvent('secops_audit_event', {
      detail: {
        action: newStatus === 'Disabled' ? 'USER_DISABLED' : 'USER_ACTIVATED',
        resource: `User / ${userId}`,
        details: `Admin ${currentUser?.name} set status of ${target.name} to ${newStatus}`,
        user: currentUser?.name || 'Admin',
        role: currentUser?.role || 'Admin'
      }
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        users,
        sessionExpiresAt: session?.expiresAt || null,
        login,
        signup,
        logout,
        resetPassword,
        updateUserProfile,
        updateUserRoleByAdmin,
        toggleUserStatusByAdmin,
        getRoleDashboardPath,
        checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
