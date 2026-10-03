import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { SeverityLevel, IncidentStatus } from '../../types';

interface IncidentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentCreateModal: React.FC<IncidentCreateModalProps> = ({ isOpen, onClose }) => {
  const { createIncident, users, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [status, setStatus] = useState<IncidentStatus>('New');
  const [affectedService, setAffectedService] = useState('payment-gateway-api');
  const [affectedSystemsInput, setAffectedSystemsInput] = useState('payment-gw-prod-01, k8s-ingress-prod');
  const [commander, setCommander] = useState(currentUser.name);
  const [responder, setResponder] = useState('David Chen');
  const [tagsInput, setTagsInput] = useState('Security, Latency, Ingress');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createIncident({
      title,
      description,
      severity,
      status,
      affectedService,
      affectedSystems: affectedSystemsInput.split(',').map(s => s.trim()).filter(Boolean),
      incidentCommander: commander,
      assignedResponder: responder,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    });

    onClose();
    // Reset form
    setTitle('');
    setDescription('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Security Incident" subtitle="Open a new tracked incident ticket with full audit logging" maxWidth="2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Incident Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Unusual Ingress Spikes & 504 Timeouts on Core Gateway"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Initial Observations <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide context on initial symptom, detection source, and immediate impact..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Critical">Critical (Immediate Response Required)</option>
              <option value="High">High (Severe Degradation)</option>
              <option value="Medium">Medium (Moderate Impact)</option>
              <option value="Low">Low (Minor Non-Critical)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="New">New</option>
              <option value="Investigating">Investigating</option>
              <option value="Mitigating">Mitigating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affected Service
            </label>
            <input
              type="text"
              value={affectedService}
              onChange={(e) => setAffectedService(e.target.value)}
              placeholder="e.g. payment-gateway-api"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Affected Systems / Pods (Comma separated)
            </label>
            <input
              type="text"
              value={affectedSystemsInput}
              onChange={(e) => setAffectedSystemsInput(e.target.value)}
              placeholder="e.g. pod-01, host-b, redis-01"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Incident Commander
            </label>
            <select
              value={commander}
              onChange={(e) => setCommander(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Responder
            </label>
            <select
              value={responder}
              onChange={(e) => setResponder(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {users.map(u => (
                <option key={u.id} value={u.name}>{u.name} ({u.title})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tags (Comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Security, API, WAF, Database"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Create Incident Ticket
          </button>
        </div>
      </form>
    </Modal>
  );
};
