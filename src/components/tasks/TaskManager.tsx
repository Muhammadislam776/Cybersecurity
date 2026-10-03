import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Search, 
  User, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime, getPriorityClasses } from '../../utils/formatters';
import { TaskStatus, TaskPriority } from '../../types';

export const TaskManager: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTaskStatus, 
    incidents, 
    navigateToIncident, 
    checkPermission 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentId, setIncidentId] = useState(incidents[0]?.id || 'INC-2026-0891');
  const [assignedTo, setAssignedTo] = useState('David Chen');
  const [priority, setPriority] = useState<TaskPriority>('P1 - Urgent');
  const [approvalReq, setApprovalReq] = useState(false);

  const canManageTasks = checkPermission('manage_tasks');

  const filtered = tasks.filter(t => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;

    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / Math.max(1, tasks.length)) * 100);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      incidentId,
      title,
      description,
      assignedTo,
      priority,
      status: 'Pending',
      dueTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
      approvalRequired: approvalReq
    });

    setCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-5">
      {/* Visual SRE Execution Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/sre_incident_response.jpg"
              alt="SRE Response Action Coordination Desk"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-blue-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-blue-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
              <span>SRE DESK ACTIVE</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>RESPONDER: CLUSTER-01</span>
              <span className="text-emerald-400 font-bold">{progressPercent}% DONE</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Response Action Coordination &amp; Containment</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {tasks.length} RESPONSE TASKS
              </span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Track multi-stage incident containment checklists, assign SRE specialists, monitor execution SLAs, and route actions requiring Commander approval.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Completed Tasks</span>
                <span className="text-sm font-bold text-emerald-400">{completedCount} / {tasks.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Pending Approval</span>
                <span className="text-sm font-bold text-amber-400">{tasks.filter(t => t.approvalRequired && t.status === 'Pending').length} Req</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Urgent P1 Tasks</span>
                <span className="text-sm font-bold text-red-400">{tasks.filter(t => t.priority.startsWith('P1')).length} Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Task Execution Queue</h3>
          <p className="text-xs text-slate-500">Containment checklists, diagnostic assignments, and remediation workflows.</p>
        </div>

        <div className="flex items-center gap-3">
          {canManageTasks && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Overview Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-700 font-semibold">Incident Remediation Progress</span>
            <span className="text-blue-600 font-bold">{completedCount} of {tasks.length} Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
            {tasks.filter(t => t.status === 'Awaiting Approval').length} Awaiting Approval
          </span>
          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
            {tasks.filter(t => t.status === 'In Progress').length} In Progress
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search task ID, title, assignee, or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Approval">Awaiting Approval</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="P1 - Urgent">P1 - Urgent</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <div key={task.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {task.id}
                </span>
                <button
                  onClick={() => navigateToIncident(task.incidentId, 'tasks')}
                  className="font-mono text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Flame className="w-3 h-3" />
                  <span>{task.incidentId}</span>
                </button>
                <h3 className="text-xs font-bold text-slate-900">{task.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityClasses(task.priority)}`}>
                  {task.priority}
                </span>
                <Badge variant="status" status={task.status} size="sm">
                  {task.status}
                </Badge>
                {task.approvalRequired && <SecurityBadge type="human_approval_required" size="sm" />}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{task.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono">
                <span>Assignee: <strong className="text-slate-700 font-sans">{task.assignedTo}</strong></span>
                <span>•</span>
                <span>Due: <strong className="text-slate-600">{formatRelativeTime(task.dueTime)}</strong></span>
                {task.completionTime && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-600 font-sans font-medium">Completed: {formatRelativeTime(task.completionTime)}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            {canManageTasks && (
              <div className="flex items-center gap-2 shrink-0">
                {task.status !== 'Completed' ? (
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Completed')}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark Done
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Completed
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Incident Response Task"
        subtitle="Schedule remediation or containment actions"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apply Token Bucket Rate Limit on Ingress WAF"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Protocol Instructions
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact commands or mitigation procedures..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Incident Association
              </label>
              <select
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
              >
                {incidents.map(i => (
                  <option key={i.id} value={i.id}>{i.id} - {i.title.substring(0, 25)}...</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignee
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="David Chen">David Chen (Responder)</option>
                <option value="Elena Rostova">Elena Rostova (Analyst)</option>
                <option value="Marcus Vance">Marcus Vance (Commander)</option>
                <option value="Sarah Connor">Sarah Connor (Admin)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="P1 - Urgent">P1 - Urgent</option>
              <option value="P2 - High">P2 - High</option>
              <option value="P3 - Medium">P3 - Medium</option>
              <option value="P4 - Low">P4 - Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="apprCheck"
              checked={approvalReq}
              onChange={(e) => setApprovalReq(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="apprCheck" className="text-xs text-slate-700 font-medium">
              Requires Commander Approval before executing action
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Schedule Response Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
