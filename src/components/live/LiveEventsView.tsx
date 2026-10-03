import React, { useState } from 'react';
import { 
  Radio, 
  Pause, 
  Play, 
  Filter, 
  Flame, 
  BellRing, 
  UserCheck, 
  FileSearch, 
  Webhook, 
  PlayCircle, 
  Send,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { SeverityLevel } from '../../types';

export const LiveEventsView: React.FC = () => {
  const { 
    liveEvents, 
    isLiveStreamPaused, 
    toggleLiveStreamPause, 
    addLiveEvent, 
    navigateToIncident 
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  // Manual Event Injector Modal
  const [injectModalOpen, setInjectModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState<any>('alert');
  const [eventSeverity, setEventSeverity] = useState<SeverityLevel>('High');
  const [eventSource, setEventSource] = useState('CrowdStrike Falcon Sensor');

  const filtered = liveEvents.filter(e => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    if (severityFilter !== 'All' && e.severity !== severityFilter) return false;
    return true;
  });

  const handleInjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addLiveEvent({
      title: eventTitle,
      description: eventDesc || 'Telemetry packet ingested via Live Stream socket.',
      category: eventCategory,
      severity: eventSeverity,
      source: eventSource
    });

    setInjectModalOpen(false);
    setEventTitle('');
    setEventDesc('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'incident': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'alert': return <BellRing className="w-4 h-4 text-red-500" />;
      case 'approval': return <UserCheck className="w-4 h-4 text-blue-500" />;
      case 'evidence': return <FileSearch className="w-4 h-4 text-indigo-500" />;
      case 'webhook': return <Webhook className="w-4 h-4 text-purple-500" />;
      case 'simulation': return <PlayCircle className="w-4 h-4 text-amber-500" />;
      default: return <Radio className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Global Live Socket Stream Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/global_threat_radar.jpg" 
            alt="Real-Time Global Threat Radar & Event Bus" 
            className="w-full h-full object-cover opacity-25 group-hover:scale-105 group-hover:opacity-30 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className={`w-2 h-2 rounded-full ${isLiveStreamPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                {isLiveStreamPaused ? 'STREAM PAUSED' : 'UNIFIED EVENT BUS ACTIVE'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                TOTAL BUFFER: {liveEvents.length} EVENTS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Live Telemetry & Socket Stream Feed
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time socket pipeline streaming security incidents, correlated alert triggers, forensic evidence additions, and commander approval events with microsecond precision.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                WebSocket Reconnect: Resilient
              </span>
              <span>&bull;</span>
              <span>Zero-Loss Buffer</span>
              <span>&bull;</span>
              <span>Sub-Second Latency</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLiveStreamPause}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  isLiveStreamPaused
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {isLiveStreamPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isLiveStreamPaused ? 'Resume Feed' : 'Pause Stream'}</span>
              </button>

              <button
                onClick={() => setInjectModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Emit Test Event</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <SecurityBadge type="audit_logged" size="sm" />
              <SecurityBadge type="rbac_enforced" size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-400 uppercase text-[11px] mr-1">Category:</span>
          {['All', 'alert', 'incident', 'approval', 'evidence', 'webhook', 'simulation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400 uppercase text-[11px]">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="py-1 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Stream Event List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 divide-y divide-slate-100 space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-start gap-3 hover:bg-slate-50/60 p-2 rounded-lg transition-colors">
            <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
              {getCategoryIcon(item.category)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{item.title}</span>
                  <Badge variant="severity" severity={item.severity} size="sm">{item.severity}</Badge>
                  <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {formatRelativeTime(item.timestamp)}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>

              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                <span>Source: <strong>{item.source}</strong></span>
                {item.incidentId && (
                  <button
                    onClick={() => navigateToIncident(item.incidentId!, 'overview')}
                    className="text-blue-600 hover:underline font-bold flex items-center gap-1 font-sans"
                  >
                    <span>Linked Incident: {item.incidentId}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inject Modal */}
      <Modal
        isOpen={injectModalOpen}
        onClose={() => setInjectModalOpen(false)}
        title="Emit Simulated Real-Time Telemetry Event"
        subtitle="Manually fire an event into the live stream bus"
        maxWidth="md"
      >
        <form onSubmit={handleInjectSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="e.g. AWS GuardDuty: Unusual Port Scan Activity"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Description
            </label>
            <textarea
              rows={2}
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              placeholder="Telemetry payload summary..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value as any)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="alert">Alert</option>
                <option value="incident">Incident</option>
                <option value="webhook">Webhook</option>
                <option value="evidence">Evidence</option>
                <option value="approval">Approval</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Severity</label>
              <select
                value={eventSeverity}
                onChange={(e) => setEventSeverity(e.target.value as SeverityLevel)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Source Sensor</label>
            <input
              type="text"
              value={eventSource}
              onChange={(e) => setEventSource(e.target.value)}
              placeholder="e.g. Okta Verify / AWS WAF"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setInjectModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Emit Live Event</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
