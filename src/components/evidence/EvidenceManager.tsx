import React, { useState } from 'react';
import { 
  FileSearch, 
  Plus, 
  Search, 
  CheckCircle2, 
  Lock, 
  Download, 
  ShieldCheck, 
  Flame, 
  FileCode, 
  FileText, 
  Activity, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { RedactedText } from '../common/RedactedText';
import { Modal } from '../common/Modal';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { formatShortHash } from '../../utils/crypto';
import { EvidenceItem } from '../../types';

export const EvidenceManager: React.FC = () => {
  const { evidence, addEvidence, incidents, navigateToIncident, checkPermission, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [incidentFilter, setIncidentFilter] = useState<string>('All');

  // Upload Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<any>('log_snippet');
  const [incidentId, setIncidentId] = useState(incidents[0]?.id || 'INC-2026-0891');
  const [source, setSource] = useState('prod-edge-gateway-01');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const canAddEvidence = checkPermission('add_evidence');

  const filtered = evidence.filter(e => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        e.id.toLowerCase().includes(q) ||
        e.title.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (typeFilter !== 'All' && e.type !== typeFilter) return false;
    if (incidentFilter !== 'All' && e.incidentId !== incidentFilter) return false;

    return true;
  });

  const handlePresetFill = (preset: 'aws' | 'auth' | 'sql') => {
    if (preset === 'aws') {
      setTitle('CloudTrail Suspicious STS AssumeRole Call');
      setType('event_record');
      setDescription('Captured API call with leaked AWS credentials in authorization headers');
      setContent(`{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "IAMUser",
    "principalId": "AIDAJQABLZS4A3QWEXAMPLE",
    "arn": "arn:aws:iam::123456789012:user/temp_deploy",
    "accountId": "123456789012",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE"
  },
  "eventTime": "2026-09-30T14:40:12Z",
  "eventSource": "sts.amazonaws.com",
  "eventName": "AssumeRole",
  "awsRegion": "us-east-1",
  "requestParameters": {
    "roleArn": "arn:aws:iam::123456789012:role/AdministratorAccess",
    "roleSessionName": "automated-agent-session"
  },
  "secret_header": "Authorization: Bearer sk_mock_9942a8b27c19f091823abce18293d"
}`);
    } else if (preset === 'auth') {
      setTitle('NGINX Ingress Auth Failure Stream');
      setType('log_snippet');
      setDescription('High frequency auth failures containing plaintext credential attempts');
      setContent(`[2026-09-30T14:35:10Z] POST /v1/auth/login HTTP/2.0 401 245
client_ip: 185.220.101.44
user: root_admin@cyberops.corp
password: "SuperSecretPassword123!"
api_secret: "sk_mock_auth_9812739182470129"
upstream_connect_time: 0.012`);
    } else {
      setTitle('Database Connection Leak Trace');
      setType('diagnostic_output');
      setDescription('Captured exception stack trace with embedded database connection string');
      setContent(`FATAL: Connection pool limit reached.
Caused by: org.postgresql.util.PSQLException: FATAL: remaining connection slots are reserved for non-replication superuser connections
at ConnectionPool.getConnection(Pool.java:142)
Connection string: postgresql://db_admin:db_password=SuperSecretPostgresPassword99@postgres-prod.internal:5432/core_db
Active sockets: 1000/1000`);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addEvidence({
      incidentId,
      title,
      type,
      source,
      description,
      content,
      collectedBy: currentUser.name,
      fileSize: `${(content.length / 1024).toFixed(1)} KB`
    });

    setModalOpen(false);
    setTitle('');
    setDescription('');
    setContent('');
  };

  return (
    <div className="space-y-5">
      {/* Visual Forensic Lab Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg group">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center p-4 sm:p-5">
          <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-[16/10] border border-slate-800 shadow">
            <img
              src="/images/forensic_binary_inspection.jpg"
              alt="Digital Forensics Laboratory & Malware Disassembly"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>FORENSIC LAB SEALED</span>
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[10px] font-mono text-slate-300 flex justify-between">
              <span>HASH: SHA-256</span>
              <span className="text-emerald-400 font-bold">CHAIN OF CUSTODY</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2 text-white">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Forensic Evidence Vault &amp; Chain-of-Custody</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {evidence.length} SEALED ARTIFACTS
              </span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-2xl">
              Immutable digital forensics locker for memory dumps, network PCAP captures, server logs, and diagnostic traces. Real-time regex pattern interception automatically redacts credentials and API secrets prior to storage.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">SHA-256 Hashes</span>
                <span className="text-sm font-bold text-emerald-400">100% Verified</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Secret Masking</span>
                <span className="text-sm font-bold text-blue-400">Zero Leakage</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Custody Integrity</span>
                <span className="text-sm font-bold text-slate-200">Tamper-Evident</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Sealed Investigation Artifacts</h3>
          <p className="text-xs text-slate-500">Collect, verify, and inspect incident forensic artifacts.</p>
        </div>

        <div className="flex items-center gap-3">
          <SecurityBadge type="audit_logged" size="sm" />
          <SecurityBadge type="secret_redacted" size="sm" />
          {canAddEvidence && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Collect Evidence</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search evidence ID, title, source system, or description..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="All">All Types</option>
              <option value="log_snippet">Log Snippet</option>
              <option value="diagnostic_output">Diagnostic Output</option>
              <option value="event_record">Event Record</option>
              <option value="file_metadata">File Metadata</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Incident:</span>
            <select
              value={incidentFilter}
              onChange={(e) => setIncidentFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 font-mono"
            >
              <option value="All">All Incidents</option>
              {incidents.map(i => (
                <option key={i.id} value={i.id}>{i.id}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Evidence Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {item.id}
                </span>
                <button
                  onClick={() => navigateToIncident(item.incidentId, 'evidence')}
                  className="font-mono text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{item.incidentId}</span>
                </button>
                <span className="text-sm font-bold text-slate-900">{item.title}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-600">
                  {item.type.replace('_', ' ')}
                </span>
                {item.redacted && <SecurityBadge type="secret_redacted" size="sm" />}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>Source: <strong className="text-slate-700">{item.source}</strong></span>
                <span>•</span>
                <span>{item.fileSize || '3.2 KB'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

            {/* Redacted Content Viewer */}
            <div>
              <RedactedText content={item.content} />
            </div>

            {/* Tamper-Evident SHA-256 Hash Seal & Chain of Custody */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-700 font-sans">SHA-256 Hash:</span>
                <span className="text-slate-600 text-[11px] truncate max-w-md">{item.hash}</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 rounded">
                  Tamper-Evident Verified
                </span>
              </div>

              <div className="text-[11px] text-slate-500">
                Collector: <strong className="text-slate-800">{item.collectedBy}</strong> ({formatRelativeTime(item.collectionTimestamp)})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Collect / Upload Evidence Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Collect & Seal Forensic Evidence Artifact"
        subtitle="Automatic zero-exposure secret redaction and cryptographic SHA-256 hashing"
        maxWidth="2xl"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          {/* Quick preset buttons to test live redaction */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
            <span className="text-[11px] font-bold text-blue-900 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Test Live Secret Redaction Engine (Click to Load Presets):</span>
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePresetFill('aws')}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-blue-700 hover:bg-blue-100 rounded border border-blue-200 cursor-pointer"
              >
                AWS STS Credentials & Bearer Key
              </button>
              <button
                type="button"
                onClick={() => handlePresetFill('auth')}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-blue-700 hover:bg-blue-100 rounded border border-blue-200 cursor-pointer"
              >
                NGINX Password & API Secret
              </button>
              <button
                type="button"
                onClick={() => handlePresetFill('sql')}
                className="px-2.5 py-1 text-xs font-semibold bg-white text-blue-700 hover:bg-blue-100 rounded border border-blue-200 cursor-pointer"
              >
                PostgreSQL URI Connection String
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Artifact Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory Capture String Dump"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Artifact Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="log_snippet">Log Snippet</option>
                <option value="diagnostic_output">Diagnostic Output</option>
                <option value="event_record">Event Record</option>
                <option value="file_metadata">File Metadata</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Incident Link
              </label>
              <select
                value={incidentId}
                onChange={(e) => setIncidentId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
              >
                {incidents.map(i => (
                  <option key={i.id} value={i.id}>{i.id}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Source Node
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. k8s-node-01"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this evidence prove or capture?"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Artifact Payload / Raw Logs <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                <Lock className="w-3 h-3" /> Auto-redaction actively intercepts secrets
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw log lines or configuration snippets here..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Seal Evidence with SHA-256
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
