import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Sparkles, 
  UserCheck, 
  FileSearch, 
  Lock, 
  Radio, 
  PlayCircle, 
  Flame, 
  BellRing, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Terminal, 
  Activity, 
  Database,
  Users,
  Eye,
  Menu,
  X
} from 'lucide-react';
import { SecurityBadge } from '../components/common/SecurityBadge';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white flex flex-col font-sans">
      {/* 1. Sticky Modern Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">CyberOps</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                IR PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#ai-copilot" className="hover:text-blue-600 transition-colors">AI Copilot</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
            <a href="#trust" className="hover:text-blue-600 transition-colors">About</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white p-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-2 text-xs font-semibold text-slate-700">
              <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-1.5">Home</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1.5">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="py-1.5">How It Works</a>
              <a href="#ai-copilot" onClick={() => setMobileMenuOpen(false)} className="py-1.5">AI Copilot</a>
              <a href="#security" onClick={() => setMobileMenuOpen(false)} className="py-1.5">Security</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="py-1.5">About</a>
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link to="/login" className="w-full py-2 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                Sign In
              </Link>
              <Link to="/signup" className="w-full py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Autonomous SOC Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                AI-Powered Incident Response Platform
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Detect incidents, investigate alerts, coordinate response teams, and make safer decisions with human-controlled AI assistance.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/signup"
                  className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="#features"
                  className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Explore Platform
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Human-in-the-Loop
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero Secret Leakage
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 6-Role Granular RBAC
                </span>
              </div>
            </div>

            {/* Right Hero Preview / Command Center Visual */}
            <div className="lg:col-span-6 relative">
              {/* Ambient Glow Aura */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-1000 -z-10" />

              <div className="relative rounded-2xl border-2 border-slate-800/80 bg-slate-950 p-2 shadow-2xl overflow-hidden group">
                {/* Visual Window Header */}
                <div className="bg-slate-900 rounded-t-xl px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-slate-400 ml-2">cyberops-soc-command // LIVE TELEMETRY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                      DEFCON 2
                    </span>
                  </div>
                </div>

                {/* Primary Image Container with Zoom & Scanline Effects */}
                <div className="relative aspect-video overflow-hidden rounded-b-xl">
                  <img
                    src="/images/soc_command_center.jpg"
                    alt="CyberOps 24/7 Security Operations Incident Command Center"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Vignette & Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Floating HUD Pill 1: Top-Left */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-white shadow-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>INGESTION: <strong className="text-cyan-300">14,832 EPS</strong></span>
                  </div>

                  {/* Floating HUD Pill 2: Top-Right */}
                  <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-white shadow-lg flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>AI COPILOT: <strong className="text-purple-300">ACTIVE</strong></span>
                  </div>

                  {/* Floating HUD Bar: Bottom Overlay */}
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE THREAT CONTAINMENT</div>
                        <div className="font-bold text-white text-xs sm:text-sm">Global Autonomous Incident Response Platform</div>
                      </div>
                      <Link
                        to="/login"
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors shrink-0 flex items-center gap-1"
                      >
                        <span>Launch Platform</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Precision, Safety, and Operational Speed
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every component is architected to give security operations teams maximum visibility without risking autonomous failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: 'Real-Time Incident Monitoring',
                desc: 'Monitor incidents and alerts from multiple cloud, SIEM, and APM telemetry sources in real time.'
              },
              {
                icon: Sparkles,
                title: 'AI Incident Copilot',
                desc: 'Summarize incidents, analyze blast radius, and recommend safe diagnostic actions from verified runbooks.'
              },
              {
                icon: UserCheck,
                title: 'Human Approval Controls',
                desc: 'Important or state-changing actions strictly require explicit human commander authorization.'
              },
              {
                icon: FileSearch,
                title: 'Evidence Management',
                desc: 'Collect, seal, and verify investigation artifacts with automated zero-exposure secret redaction.'
              },
              {
                icon: Users,
                title: 'RBAC Security Governance',
                desc: 'Control operational access according to 6 user roles and 11 fine-grained permission categories.'
              },
              {
                icon: ShieldAlert,
                title: 'Immutable Audit Logs',
                desc: 'Append-only ledger with sequential SHA-256 state hashing tracks every login, approval, and action.'
              },
              {
                icon: Radio,
                title: 'Live Real-Time Events',
                desc: 'Unified websocket-style streaming event bus broadcasts alerts, state changes, and webhook events.'
              },
              {
                icon: PlayCircle,
                title: 'Incident Simulation Center',
                desc: 'Practice realistic crisis scenarios in a sandboxed environment without touching production systems.'
              },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Response Lifecycle</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A 5-Step Human-Controlled Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              How CyberOps takes raw alerts and transforms them into coordinated, verified mitigations.
            </p>
          </div>

          {/* Global Satellite Threat Radar Visual Card */}
          <div className="mb-10 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-700 -z-10" />
            <div className="relative rounded-2xl border-2 border-slate-800 bg-slate-950 p-2 shadow-2xl overflow-hidden">
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
                <img
                  src="/images/global_threat_radar.jpg"
                  alt="Global Cyber Threat Telemetry Radar Network"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Satellite Radar Telemetry Overlay */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-blue-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ORBITAL SATELLITE RADAR: <strong className="text-white">148/150 ACTIVE</strong></span>
                </div>

                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                  <span>WORLDWIDE THREAT NODES: <strong className="text-amber-400">14,832</strong></span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-lg">
                  <div>
                    <span className="text-slate-400 text-[10px] block">GLOBAL TELEMETRY INGESTION PIPELINE</span>
                    <span className="text-white font-bold">WAF, EDR, SIEM, and CloudTrail Real-Time Event Correlation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      LATENCY: 8MS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                      ZERO PACKET LOSS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-step visual pipeline with connecting line */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Detect', desc: 'Ingest alerts from SIEM, WAF, CloudTrail, and APM systems.' },
              { step: '02', title: 'Investigate', desc: 'Aggregate telemetry, inspect redacted logs, and assemble evidence.' },
              { step: '03', title: 'AI Analysis', desc: 'Copilot synthesizes root cause & matches approved runbooks.' },
              { step: '04', title: 'Human Approval', desc: 'Incident Commander reviews risk rating and signs off.' },
              { step: '05', title: 'Respond & Audit', desc: 'Safe execution is recorded in the immutable SHA-256 ledger.' },
            ].map((st, sIdx) => (
              <div key={sIdx} className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2 relative">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {st.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Security Section */}
      <section id="security" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Hardening</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Security Built Into Every Layer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Zero plaintext secrets, strict RBAC authorization, and append-only cryptographic logging.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
            {/* Visual Security Vault Banner */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition duration-700 -z-10" />
              <div className="relative rounded-2xl border-2 border-slate-800 bg-slate-950 p-2 shadow-xl overflow-hidden">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img
                    src="/images/cyber_security_vault.jpg"
                    alt="Cryptographic Immutable Audit Vault"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 rounded-lg px-2.5 py-1 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>ZERO-TRUST AUDIT VAULT</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-lg">
                    <span>HASH CHAIN: SHA-256</span>
                    <span className="text-emerald-400 font-bold">100% TAMPER-EVIDENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Feature Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Automated Secret Redaction</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-12">
                  Real-time pattern interception masks API keys (`sk_live_...`), JWT tokens, database URIs, and private RSA keys before display or storage.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-orange-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Human-in-the-Loop AI Model</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-12">
                  The AI is constrained to Observe & Recommend. It has no autonomous capability to restart services, delete data, or execute commands directly.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 hover:border-emerald-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Tamper-Evident Audit Ledger</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-12">
                  Chained SHA-256 state hashes maintain an immutable historical record. Normal users and administrators are blocked from editing past logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI Copilot Section with Mock Dialogue & Visual Showcase */}
      <section id="ai-copilot" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Context-Aware Intelligence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI That Advises — Never Acts Without Human Consent
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tired of "autonomous" agents making unpredictable infrastructure changes? CyberOps guarantees that every operational mitigation stays in the hands of authorized engineers.
              </p>

              {/* AI Neural Copilot Visual Thumbnail */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-md group">
                <img
                  src="/images/ai_threat_copilot.jpg"
                  alt="AI Cyber Sentinel Neural Analysis"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    AUTONOMOUS NEURAL CORRELATION ENGINE
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Synthesizes incident blast radius in under 3 seconds</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matches strictly approved, human-reviewed SOP runbooks</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Submits formal approval requests for commander review</span>
                </div>
              </div>
            </div>

            {/* Mock Copilot Chat Showcase */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Incident Copilot Session #INC-1042</span>
                </div>
                <SecurityBadge type="ai_generated" size="sm" />
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-xl rounded-tr-none max-w-md font-medium">
                    &quot;What is happening with Incident INC-1042?&quot;
                  </div>
                </div>

                {/* Copilot message */}
                <div className="flex justify-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 text-slate-200 p-3.5 rounded-xl rounded-tl-none max-w-lg space-y-2">
                    <p className="leading-relaxed">
                      &quot;This incident involves increased API failures affecting the payment service. Three related alerts were detected within the last 8 minutes.&quot;
                    </p>

                    {/* Diagnostic Callout */}
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-[11px]">Recommended Diagnostic:</span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          Human Approval Required
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        Review recent deployment events and API error logs. (Risk: Low • Permission: view_evidence)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Incident Response Workflow & Role Coordination */}
      <section id="workflow" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Role Coordination</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              One Unified Platform &bull; Six Specialized Personas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Every role in your incident response organization operates inside a dedicated, purpose-built cockpit designed strictly for their operational remit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Incident Commander
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">LEAD CSIRT</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Command & Executive Authority</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Declares critical incidents, manages severity transitions, delegates response tasks to responders, and reviews AI mitigation recommendations for sign-off.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Security Analyst
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">SOC TRIAGE</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Alert Triage & Evidence Collection</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Investigates telemetry alerts from CrowdStrike, Cloudflare, and GuardDuty. Assembles cryptographic evidence and formulates diagnostic hypotheses.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Incident Responder
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">INFRASTRUCTURE</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Playbook Execution & Mitigation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Executes assigned containment tasks, reviews approved SOP runbooks, updates task status in real time, and logs diagnostic outputs safely.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  Platform Administrator
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">ROOT GOVERNANCE</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">RBAC Policies & Integrations</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provisions user accounts, manages RBAC permission matrices, configures webhook telemetry ingestion, and manages sandbox simulation drills.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Compliance Auditor
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">READ-ONLY GRC</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Tamper-Proof Audit & Certification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspects append-only SHA-256 historical ledgers, verifies approval chains of custody, and generates SOC 2 and ISO 27001 compliance certificates.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Operational Viewer
                </span>
                <span className="text-[11px] font-mono text-slate-400 font-bold">READ-ONLY OPS</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Monitoring & Status Visibility</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Monitors active incident timelines, service availability indicators, and live telemetry feeds without modification or administrative permissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials / Enterprise Trust Section */}
      <section id="trust" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Trust & Security</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Premier Security Operations Teams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Battle-tested in high-throughput enterprise production and mission-critical cloud environments.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;CyberOps eliminated our fear of AI making rogue changes during an outage. The strict human approval checkpoint means our Incident Commanders retain complete oversight while cutting diagnostic time by 70%.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-xs text-slate-900">Marcus Vance</div>
                <div className="text-[11px] text-slate-500">VP of Security Operations &bull; Global Payments Corp</div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;The immutable SHA-256 cryptographic audit ledger passed our rigorous SOC 2 Type II audit with zero exceptions. It is the gold standard for evidence integrity in modern SecOps.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-xs text-slate-900">Elena Rostova</div>
                <div className="text-[11px] text-slate-500">Chief Information Security Officer &bull; CloudScale SaaS</div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                &ldquo;Distributing incident response across separate roles transformed our operations. Our responders only see what they need to fix, while our analysts get undisturbed triage visibility.&rdquo;
              </p>
              <div className="pt-3 border-t border-slate-200">
                <div className="font-bold text-xs text-slate-900">Devon Chen</div>
                <div className="text-[11px] text-slate-500">Lead Incident Commander &bull; Nexa Infrastructure</div>
              </div>
            </div>
          </div>

          {/* Security Compliance Badges */}
          <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 flex flex-wrap items-center justify-around gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SOC 2 TYPE II CERTIFIED</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ISO 27001 ALIGNED</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>HIPAA COMPLIANT LEDGER</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ZERO PLAINTEXT SECRETS</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>AIR-GAPPED SANDBOX READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to respond to incidents smarter?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Empower your Incident Commanders, Analysts, and Responders with safe, human-controlled AI assistance today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/signup"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl shadow-lg transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-colors"
            >
              Sign In to Platform
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer id="about" className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-blue-500" />
                <span>CyberOps IR</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                Enterprise Incident Response and Governance Platform with strict human-in-the-loop safety controls.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Product</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#ai-copilot" className="hover:text-white transition-colors">AI Copilot</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Live Demo</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Security</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><a href="#security" className="hover:text-white transition-colors">Zero-Exposure Redaction</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Audit Hash Chains</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">RBAC Governance</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">SOC 2 Alignment</a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Legal & Contact</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Security Disclosure</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact Support</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} CyberOps Security Systems, Inc. All rights reserved.</p>
            <p className="font-mono">Tamper-Evident Genesis Verified • Build v3.4.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
