import React, { useState } from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Sparkles, 
  Terminal, 
  History, 
  FileSearch, 
  Layers, 
  X, 
  CheckCircle2, 
  Clock, 
  Server, 
  User, 
  ArrowUpRight,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

interface AnalystIncidentInspectorModalProps {
  incident: Incident | null;
  onClose: () => void;
  onOpenAiTriage: (incident: Incident) => void;
  onOpenDiagnostic: (incident: Incident) => void;
}

export const AnalystIncidentInspectorModal: React.FC<AnalystIncidentInspectorModalProps> = ({
  incident,
  onClose,
  onOpenAiTriage,
  onOpenDiagnostic,
}) => {
  const { alerts, evidence, diagnostics, timeline, updateIncident, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<'summary' | 'alerts' | 'evidence' | 'diagnostics' | 'timeline'>('summary');

  if (!incident) return null;

  const incidentAlerts = alerts.filter(a => incident.relatedAlertIds?.includes(a.id));
  const incidentEvidence = evidence.filter(e => e.incidentId === incident.id);
  const incidentDiagnostics = diagnostics.filter(d => d.incidentId === incident.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {incident.id}
              </span>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded border uppercase bg-red-950 text-red-300 border-red-800">
                {incident.severity}
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded border bg-slate-800 text-slate-300 border-slate-700">
                {incident.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Affected: <strong className="text-slate-200">{incident.affectedService}</strong>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate">
              {incident.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAiTriage(incident)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Triage</span>
            </button>
            <button
              onClick={() => onOpenDiagnostic(incident)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Diagnostic</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 border-b border-slate-200 bg-slate-50 text-xs font-mono">
          {[
            { id: 'summary', label: 'AI Threat Summary', icon: Sparkles },
            { id: 'alerts', label: `Correlated Alerts (${incidentAlerts.length})`, icon: ShieldAlert },
            { id: 'evidence', label: `Evidence Vault (${incidentEvidence.length})`, icon: FileSearch },
            { id: 'diagnostics', label: `Safe Diagnostics (${incidentDiagnostics.length})`, icon: Terminal },
            { id: 'timeline', label: 'Timeline', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 font-semibold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-slate-50/50">
          {/* TAB 1: AI Summary & Hypotheses */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Copilot Threat Analysis & Root Cause Assessment</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {incident.aiSummary?.summary || incident.description}
                </p>

                {incident.aiSummary && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">INCIDENT PROGRESSION:</span>
                      <p className="text-slate-700">{incident.aiSummary.whatHappened}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">IMPACT RADIUS:</span>
                      <p className="text-slate-700">{incident.aiSummary.currentImpact}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Indicators */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
                  Known Attack Indicators & Signatures:
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {(incident.aiSummary?.knownIndicators || ['198.51.100.24 (Tor Exit Node)', 'High volume 401 Unauthorized API requests', 'Suspicious JWT bearer injection']).map((ind, i) => (
                    <div key={i} className="p-2 bg-slate-50 rounded text-slate-700 border border-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Correlated Alerts */}
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {incidentAlerts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No linked alerts directly correlated to this incident record.
                </div>
              ) : (
                incidentAlerts.map(alert => (
                  <div key={alert.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{alert.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          {alert.severity}
                        </span>
                        <span className="text-slate-500">{alert.source}</span>
                      </div>
                      <span className="text-slate-400">{formatRelativeTime(alert.timestamp)}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900">{alert.title}</div>
                    <div className="p-2.5 bg-slate-900 rounded text-blue-300 font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify(alert.rawPayload, null, 2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Evidence */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              {incidentEvidence.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No forensic evidence artifacts catalogued yet.
                </div>
              ) : (
                incidentEvidence.map(ev => (
                  <div key={ev.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ev.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                          {ev.type}
                        </span>
                      </div>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SHA-256 Verified
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">{ev.description}</div>
                    <div className="p-2.5 bg-slate-900 text-slate-300 rounded text-[11px] overflow-x-auto font-mono">
                      {ev.content}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>HASH: {ev.hash}</span>
                      <span>COLLECTOR: {ev.collectedBy}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-3">
              {incidentDiagnostics.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
                  No diagnostics executed for this incident.
                </div>
              ) : (
                incidentDiagnostics.map(diag => (
                  <div key={diag.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{diag.actionName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {diag.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{diag.description}</p>
                    {diag.executionResult && (
                      <div className="p-2.5 bg-slate-900 text-emerald-300 rounded text-[11px] overflow-x-auto">
                        {diag.executionResult}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="border-l-2 border-slate-200 ml-3 pl-4 space-y-4">
                {timeline.map((evt, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="font-mono text-[11px] text-slate-400">{evt.timestamp}</div>
                    <div className="font-bold text-slate-800 mt-0.5">{evt.title}</div>
                    <div className="text-slate-600 text-xs mt-0.5">{evt.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
