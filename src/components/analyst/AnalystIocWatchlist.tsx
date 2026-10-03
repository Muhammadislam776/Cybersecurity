import React, { useState } from 'react';
import { 
  Fingerprint, 
  Globe, 
  Hash, 
  ShieldAlert, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Search, 
  AlertTriangle,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface IOCRecord {
  id: string;
  type: 'IP' | 'SHA-256' | 'Domain' | 'C2 URL';
  value: string;
  threatScore: number; // 0 to 100
  threatClassification: 'Malicious' | 'Suspicious' | 'Clean';
  asnOrRegistrar: string;
  associatedIncident: string;
  firstSeen: string;
  reputationSource: string;
}

const INITIAL_IOCS: IOCRecord[] = [
  {
    id: 'IOC-8821',
    type: 'IP',
    value: '198.51.100.24',
    threatScore: 98,
    threatClassification: 'Malicious',
    asnOrRegistrar: 'AS13335 (Tor Exit Node)',
    associatedIncident: 'INC-2026-0891',
    firstSeen: '14 min ago',
    reputationSource: 'AbuseIPDB (100% Conf.)'
  },
  {
    id: 'IOC-8822',
    type: 'SHA-256',
    value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    threatScore: 94,
    threatClassification: 'Malicious',
    asnOrRegistrar: 'Trojan.Linux.Mirai.Gen',
    associatedIncident: 'INC-2026-0891',
    firstSeen: '28 min ago',
    reputationSource: 'VirusTotal (58/72 detections)'
  },
  {
    id: 'IOC-8823',
    type: 'Domain',
    value: 'c2-sync.crypto-telemetry-cdn.net',
    threatScore: 89,
    threatClassification: 'Malicious',
    asnOrRegistrar: 'NameSilo LLC (Created 2d ago)',
    associatedIncident: 'INC-2026-0892',
    firstSeen: '1 hour ago',
    reputationSource: 'AlienVault OTX'
  },
  {
    id: 'IOC-8824',
    type: 'IP',
    value: '203.0.113.195',
    threatScore: 78,
    threatClassification: 'Suspicious',
    asnOrRegistrar: 'AS4837 (China Unicom)',
    associatedIncident: 'INC-2026-0893',
    firstSeen: '3 hours ago',
    reputationSource: 'CrowdStrike Intelligence'
  },
  {
    id: 'IOC-8825',
    type: 'C2 URL',
    value: 'https://auth-session-gateway.info/api/v1/beacon',
    threatScore: 96,
    threatClassification: 'Malicious',
    asnOrRegistrar: 'Fast Flux Bulletproof Hosting',
    associatedIncident: 'INC-2026-0891',
    firstSeen: '42 min ago',
    reputationSource: 'Mandiant Threat Defense'
  }
];

export const AnalystIocWatchlist: React.FC = () => {
  const { navigateToIncident, addToast } = useApp();
  const [iocs, setIocs] = useState<IOCRecord[]>(INITIAL_IOCS);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIocValue, setNewIocValue] = useState('');
  const [newIocType, setNewIocType] = useState<IOCRecord['type']>('IP');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('info', 'IOC Copied', `Copied ${text} to clipboard.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddIoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIocValue.trim()) return;

    const newRecord: IOCRecord = {
      id: `IOC-${Math.floor(1000 + Math.random() * 9000)}`,
      type: newIocType,
      value: newIocValue.trim(),
      threatScore: 85,
      threatClassification: 'Suspicious',
      asnOrRegistrar: 'Manual Analyst Submission',
      associatedIncident: 'INC-2026-0891',
      firstSeen: 'Just now',
      reputationSource: 'Analyst SOC Queue'
    };

    setIocs([newRecord, ...iocs]);
    setNewIocValue('');
    setIsAddModalOpen(false);
    addToast('success', 'IOC Logged', `IOC ${newRecord.value} added to threat monitoring.`);
  };

  const filteredIocs = iocs.filter(ioc => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return ioc.value.toLowerCase().includes(q) ||
      ioc.type.toLowerCase().includes(q) ||
      ioc.asnOrRegistrar.toLowerCase().includes(q) ||
      ioc.associatedIncident.toLowerCase().includes(q);
  });

  return (
    <div id="analyst-ioc-section" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-purple-600" />
              <span>Extracted IOC Threat Watchlist</span>
              <span className="px-2 py-0.5 text-xs font-mono bg-purple-100 text-purple-800 rounded-full font-semibold">
                {filteredIocs.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Indicators of Compromise correlated against threat intelligence feeds (VirusTotal, AbuseIPDB, AlienVault).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add IOC</span>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search IOCs by IP, domain, hash, or incident ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Forensic Laboratory Inspection Visual Banner */}
        <div className="mt-4 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 group">
          <div className="relative aspect-[24/7] overflow-hidden">
            <img
              src="/images/forensic_binary_inspection.jpg"
              alt="Digital Forensics Laboratory Malware Disassembly and Binary Inspection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Floating Badges */}
            <div className="absolute top-2.5 left-3 bg-slate-950/85 backdrop-blur-md border border-cyan-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>FORENSIC LAB: BINARY DISASSEMBLY ACTIVE</span>
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
              <span className="text-slate-300">SANDBOX INSPECTION: <strong className="text-cyan-300">ELF / PE HEADERS &amp; IN-MEMORY DUMPS</strong></span>
              <span className="text-emerald-400 font-bold hidden sm:inline">SHA-256 HASH VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Type</th>
              <th className="py-2.5 px-4 font-semibold">Indicator Value</th>
              <th className="py-2.5 px-4 font-semibold">Threat Score</th>
              <th className="py-2.5 px-4 font-semibold">Intelligence Context</th>
              <th className="py-2.5 px-4 font-semibold">Associated Incident</th>
              <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredIocs.map((ioc) => (
              <tr key={ioc.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {ioc.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">{ioc.value}</span>
                    <button
                      onClick={() => handleCopy(ioc.id, ioc.value)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Copy indicator value"
                    >
                      {copiedId === ioc.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ioc.threatScore >= 90 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {ioc.threatScore}/100
                    </span>
                    <span className="text-[11px] text-slate-500">{ioc.threatClassification}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  <div>{ioc.asnOrRegistrar}</div>
                  <div className="text-[10px] text-slate-400">{ioc.reputationSource}</div>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => navigateToIncident(ioc.associatedIncident)}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{ioc.associatedIncident}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => addToast('info', 'SIEM Query Triggered', `Searching all sensor logs for IOC ${ioc.value}`)}
                    className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition-colors cursor-pointer"
                  >
                    Query SIEM
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add IOC Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Log New Indicator of Compromise (IOC)</span>
            </h3>

            <form onSubmit={handleAddIoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Indicator Type</label>
                <select
                  value={newIocType}
                  onChange={(e) => setNewIocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                >
                  <option value="IP">IP Address</option>
                  <option value="SHA-256">SHA-256 File Hash</option>
                  <option value="Domain">Malicious Domain</option>
                  <option value="C2 URL">C2 Endpoint URL</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Indicator Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 198.51.100.42 or malware hash..."
                  value={newIocValue}
                  onChange={(e) => setNewIocValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs cursor-pointer"
                >
                  Save & Correlate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
