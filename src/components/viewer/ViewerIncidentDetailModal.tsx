import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Clock, 
  User, 
  Server, 
  Tag, 
  AlertTriangle, 
  BellRing, 
  FileSearch, 
  CheckCircle2, 
  Lock, 
  X, 
  Eye, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Info
} from 'lucide-react';
import { Incident, IncidentAlert, EvidenceItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';

interface ViewerIncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
}

export const ViewerIncidentDetailModal: React.FC<ViewerIncidentDetailModalProps> = ({ 
  incident, 
  onClose 
}) => {
  const { alerts, evidence, timeline } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'alerts' | 'evidence'>('overview');
  const [selectedAlert, setSelectedAlert] = useState<IncidentAlert | null>(null);

  if (!incident) return null;

  // Filter alerts related to this incident
  const relatedAlerts = alerts.filter(a => 
    incident.relatedAlertIds?.includes(a.id) || a.relatedIncidentId === incident.id
  );

  // Filter evidence related to this incident
  const relatedEvidence = evidence.filter(e => e.incidentId === incident.id);

  // Filter or mock timeline events for this incident
  const incidentTimeline = timeline.filter(t => 
    !t.metadata?.incidentId || t.metadata?.incidentId === incident.id
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800 border border-blue-200">
              {incident.id}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="severity" severity={incident.severity} size="sm">
                {incident.severity}
              </Badge>
              <Badge variant="status" status={incident.status} size="sm">
                {incident.status}
              </Badge>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-200/80 text-[10px] font-bold text-slate-700">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>READ-ONLY VISIBILITY</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Incident Title & Meta Strip */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {incident.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              Affected Service: <strong className="text-slate-700 font-semibold">{incident.affectedService}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Incident Commander: <strong className="text-slate-700 font-semibold">{incident.incidentCommander}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Created: <span className="font-mono text-slate-600">{formatDate(incident.createdTime)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Last Updated: <span className="font-mono text-slate-600">{formatDate(incident.updatedTime)}</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-5 flex items-center gap-2 border-b border-slate-200">
            {[
              { id: 'overview', label: 'Summary & Impact' },
              { id: 'timeline', label: `Timeline (${incidentTimeline.length})` },
              { id: 'alerts', label: `Related Alerts (${relatedAlerts.length})` },
              { id: 'evidence', label: `Evidence Vault (${relatedEvidence.length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* TAB 1: SUMMARY & IMPACT */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Informational Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Viewer Clearance:</strong> This record is presented for operational situational awareness. Incident command decisions, task assignments, and diagnostic authorizations are restricted to verified Commanders and Responders.
                </p>
              </div>

              {/* Description Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Incident Description
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {incident.description}
                </p>
              </div>

              {/* Impact & Scope Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    Affected Systems & Scope
                  </h4>
                  <div className="space-y-1.5 mt-2">
                    {incident.affectedSystems.map((sys, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-mono text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span>{sys}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    Current Response Status
                  </h4>
                  <div className="space-y-2 mt-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Incident Commander:</span>
                      <span className="font-semibold text-slate-800">{incident.incidentCommander}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">Assigned Responder:</span>
                      <span className="font-semibold text-slate-800">{incident.assignedResponder}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500">MTTA (Mean Time to Ack):</span>
                      <span className="font-mono font-semibold text-slate-800">{incident.mttaMinutes} minutes</span>
                    </div>
                    {incident.mttrMinutes && (
                      <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                        <span className="text-slate-500">MTTR (Mean Time to Resolve):</span>
                        <span className="font-mono font-semibold text-emerald-700">{incident.mttrMinutes} minutes</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {incident.tags && incident.tags.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    Classification Tags
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {incident.tags.map((tag, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERTICAL TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Chronological Incident Timeline
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {incidentTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-3.5 hover:bg-slate-100/70 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="font-mono text-[11px] text-slate-500">{formatDate(item.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.description}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                        <User className="w-3 h-3" />
                        <span>Actor: {item.actor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RELATED ALERTS */}
          {activeTab === 'alerts' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Alert ID</th>
                      <th className="px-4 py-3">Alert Name</th>
                      <th className="px-4 py-3">Severity</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {relatedAlerts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No related alerts linked to this incident record.
                        </td>
                      </tr>
                    ) : (
                      relatedAlerts.map(alert => (
                        <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-mono text-blue-700 font-semibold">{alert.id}</td>
                          <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{alert.title}</td>
                          <td className="px-4 py-3">
                            <Badge variant="severity" severity={alert.severity} size="sm">
                              {alert.severity}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{alert.source}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{formatDate(alert.timestamp)}</td>
                          <td className="px-4 py-3">
                            <Badge variant="status" status={alert.status} size="sm">
                              {alert.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedAlert(alert)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
                            >
                              Inspect Alert
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: EVIDENCE VAULT */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-emerald-600" />
                  Chain of custody artifacts are cryptographically hashed and tamper-evident.
                </span>
                <span className="font-semibold text-slate-500">Viewer: Read-Only Vault Access</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedEvidence.length === 0 ? (
                  <div className="col-span-2 p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
                    No evidence items currently attached to this incident.
                  </div>
                ) : (
                  relatedEvidence.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                            {item.type.replace('_', ' ')}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1">{item.title}</h4>
                        </div>
                        {item.hashVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            Integrity Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                            Integrity Status Unknown
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">{item.description}</p>

                      <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-24">
                        <code>{item.content}</code>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>By {item.collectedBy}</span>
                        <span>{formatDate(item.collectionTimestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Read-Only Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Security Clearance: Viewer (Observation Only)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Sub-modal for Read-Only Alert Inspection */}
      {selectedAlert && (
        <div 
          className="fixed inset-0 z-60 bg-slate-900/60 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedAlert(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700">{selectedAlert.id}</span>
                <Badge variant="severity" severity={selectedAlert.severity} size="sm">
                  {selectedAlert.severity}
                </Badge>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedAlert.title}</h3>
              <p className="text-xs text-slate-500 mt-1">Source: {selectedAlert.source} • Service: {selectedAlert.affectedService}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Detection Type:</span>
                <span className="font-semibold text-slate-800">{selectedAlert.detectionType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Responder:</span>
                <span className="font-semibold text-slate-800">{selectedAlert.assignedResponder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="font-mono text-slate-700">{formatDate(selectedAlert.timestamp)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[11px]">
              Viewer permissions do not permit acknowledge or triage state updates.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
