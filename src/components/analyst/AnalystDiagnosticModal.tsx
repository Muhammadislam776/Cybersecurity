import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  AlertTriangle, 
  X, 
  Check, 
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Incident } from '../../types';

interface AnalystDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetIncident?: Incident | null;
}

const PRESET_DIAGNOSTICS = [
  {
    title: 'Audit Active TCP/UDP Sockets',
    command: 'ss -tulpn | grep -v "127.0.0.1"',
    risk: 'Low' as const,
    description: 'Inspect open listening sockets and external active network connections.'
  },
  {
    title: 'Inspect Container File System Diff',
    command: 'docker diff payment-gateway-api-pod-4',
    risk: 'Low' as const,
    description: 'Detect modified or created binary files inside ephemeral runtime containers.'
  },
  {
    title: 'DNS Resolver Cache Inspection',
    command: 'resolvectl statistics && resolvectl query-cache',
    risk: 'Low' as const,
    description: 'Review recent internal and external domain queries for C2 domain beacons.'
  },
  {
    title: 'Cryptographic Hash Check of Running Binaries',
    command: 'find /usr/local/bin -type f -exec sha256sum {} +',
    risk: 'Low' as const,
    description: 'Verify integrity of system binaries against known Golden Images.'
  },
  {
    title: 'Capture Non-Destructive In-Memory Dump',
    command: 'gcore -o /var/log/forensics/core.dmp $(pgrep -f "payment-srv")',
    risk: 'Medium' as const,
    description: 'Generates process memory core dump for offline malware analysis.'
  }
];

export const AnalystDiagnosticModal: React.FC<AnalystDiagnosticModalProps> = ({
  isOpen,
  onClose,
  targetIncident,
}) => {
  const { incidents, submitApprovalRequest, addToast } = useApp();
  const [selectedIncidentId, setSelectedIncidentId] = useState(
    targetIncident?.id || incidents[0]?.id || 'INC-2026-0891'
  );

  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customCommand, setCustomCommand] = useState(PRESET_DIAGNOSTICS[0].command);
  const [diagnosticTitle, setDiagnosticTitle] = useState(PRESET_DIAGNOSTICS[0].title);
  const [justification, setJustification] = useState('Correlate anomalous socket behaviors observed in WAF telemetry.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || targetIncident || incidents[0];

  const handleSelectPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setSelectedPresetIndex(index);
    setDiagnosticTitle(PRESET_DIAGNOSTICS[index].title);
    setCustomCommand(PRESET_DIAGNOSTICS[index].command);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const preset = PRESET_DIAGNOSTICS[selectedPresetIndex];

    submitApprovalRequest({
      incidentId: currentIncident.id,
      incidentTitle: currentIncident.title,
      actionTitle: diagnosticTitle,
      requestedAction: customCommand,
      requestedBy: 'Security Analyst Console',
      riskLevel: preset?.risk || 'Low',
      reason: justification,
      requiredPermission: 'request_approval'
    });

    addToast('success', 'Diagnostic Submitted', `Safe diagnostic "${diagnosticTitle}" queued for Incident Commander approval.`);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-xl w-full p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900">
                Queue Safe Diagnostic Action
              </h3>
              <p className="text-[11px] text-slate-500">Read-only diagnostic request routed to Incident Commander</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Banner */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-Destructive Guarantee: Diagnostics cannot modify state or terminate live customer traffic.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Target Incident */}
          <div>
            <label className="block font-mono font-semibold text-slate-700 mb-1">
              TARGET INCIDENT
            </label>
            <select
              value={selectedIncidentId}
              onChange={(e) => setSelectedIncidentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              {incidents.map((inc) => (
                <option key={inc.id} value={inc.id}>
                  [{inc.id}] {inc.title}
                </option>
              ))}
            </select>
          </div>

          {/* Preset Diagnostics */}
          <div>
            <label className="block font-mono font-semibold text-slate-700 mb-1.5">
              APPROVED SAFE DIAGNOSTIC RECIPES
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {PRESET_DIAGNOSTICS.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(idx)}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    selectedPresetIndex === idx
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs">{preset.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      {preset.risk} Risk
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{preset.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Command Preview */}
          <div>
            <label className="block font-mono font-semibold text-slate-700 mb-1">
              EXECUTABLE COMMAND (SANDBOXED RUNTIME)
            </label>
            <div className="bg-slate-900 text-emerald-300 p-2.5 rounded-lg font-mono text-xs overflow-x-auto">
              {customCommand}
            </div>
          </div>

          {/* Justification */}
          <div>
            <label className="block font-mono font-semibold text-slate-700 mb-1">
              INVESTIGATION RATIONALE
            </label>
            <input
              type="text"
              required
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Why is this diagnostic needed for the active investigation?"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              Request Commander Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
