import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  FileCheck
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface IncidentReport {
  id: string;
  name: string;
  category: string;
  generatedDate: string;
  period: string;
  status: 'Ready' | 'Archived';
  fileSize: string;
  summary: string;
  highlights: string[];
}

export const ViewerReportsView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const reports: IncidentReport[] = [
    {
      id: 'rep-01',
      name: 'Daily Incident Summary',
      category: 'Operational',
      generatedDate: '2026-09-30T06:00:00Z',
      period: 'Past 24 Hours (Sept 29 - Sept 30)',
      status: 'Ready',
      fileSize: '412 KB',
      summary: 'Comprehensive daily review of security incidents, alerts velocity, and team MTTA/MTTR metrics across all monitored cloud infrastructure.',
      highlights: [
        '8 Total Incidents logged, 4 successfully resolved with 38m average MTTR',
        '2 Critical security alert bursts identified and neutralized in Payment Gateway',
        'Zero unauthorized data egress attempts detected by Cloudflare WAF / AWS GuardDuty',
        '100% human-in-the-loop approvals audited with immutable cryptographic signatures'
      ]
    },
    {
      id: 'rep-02',
      name: 'Weekly Incident Summary & Trend Analysis',
      category: 'Executive',
      generatedDate: '2026-09-28T00:00:00Z',
      period: 'Week 39 (Sept 21 - Sept 27)',
      status: 'Ready',
      fileSize: '1.2 MB',
      summary: 'Weekly aggregated executive briefing covering MTTR trends, recurring diagnostic anomalies, and service availability compliance against enterprise SLAs.',
      highlights: [
        'Overall 99.94% platform uptime maintained across 6 primary service clusters',
        'API Gateway latency spike resolved via connection pool saturation playbook (RB-102)',
        '3 simulated incident fire drills completed with CSIRT and SRE responders'
      ]
    },
    {
      id: 'rep-03',
      name: 'Alert Overview & Signal-to-Noise Audit',
      category: 'Telemetry',
      generatedDate: '2026-09-30T12:00:00Z',
      period: 'Sept 1 - Sept 30 (Month to Date)',
      status: 'Ready',
      fileSize: '680 KB',
      summary: 'Statistical evaluation of telemetry alerts ingestion from Okta, CrowdStrike, GuardDuty, and Datadog to optimize alert thresholds.',
      highlights: [
        '1,420 total telemetry alerts ingested across 12 connected sensor endpoints',
        '92% automatic deduplication and alert correlation rate into active incidents',
        'Suppressed false positives reduced by 18% month-over-month'
      ]
    },
    {
      id: 'rep-04',
      name: 'Service Health & Infrastructure Uptime Report',
      category: 'SRE / Reliability',
      generatedDate: '2026-09-29T18:00:00Z',
      period: 'Rolling 30-Day Evaluation',
      status: 'Ready',
      fileSize: '540 KB',
      summary: 'Detailed performance histograms, p95/p99 latency breakdowns, and health check audit records for critical dependencies.',
      highlights: [
        'Database replica lag reached peak 450ms during batch job, degraded status flagged',
        'Authentication service achieved 99.95% uptime with 65ms mean latency',
        'Storage cluster zero error rate recorded over 1.2M S3 object transactions'
      ]
    },
    {
      id: 'rep-05',
      name: 'Incident Resolution & Post-Mortem Compilation',
      category: 'Compliance',
      generatedDate: '2026-09-25T14:30:00Z',
      period: 'Quarter 3 Post-Mortems',
      status: 'Archived',
      fileSize: '2.4 MB',
      summary: 'Curated repository of completed incident post-mortems, root cause analyses, and action-item verification records.',
      highlights: [
        '12 verified post-mortems logged with full chain-of-custody evidence',
        '100% compliance with SOC2 Type II and ISO 27001 audit controls',
        'No open regulatory disclosure obligations remaining'
      ]
    }
  ];

  const handleDownload = (report: IncidentReport) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${report.id}-${report.name.toLowerCase().replace(/\s+/g, '-')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Security & Operations Reports
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Archived incident summaries, uptime audits, and compliance documentation (Read-Only)
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 self-start md:self-auto">
          {reports.length} Reports Available
        </span>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {report.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  {report.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{report.name}</h3>
              <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{report.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {report.period}
                </span>
                <span className="font-mono">{report.fileSize}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>
                <button
                  onClick={() => handleDownload(report)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                  title="Download Summary JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReport(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedReport.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedReport.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Coverage Period:</span>
                  <span className="font-semibold text-slate-800">{selectedReport.period}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Generated Date:</span>
                  <span className="font-mono text-slate-700">{formatDate(selectedReport.generatedDate)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                  Executive Briefing
                </h4>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedReport.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                  Key Investigation & Operational Highlights
                </h4>
                <ul className="space-y-2">
                  {selectedReport.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Viewing authorized under RBAC Viewer Clearance</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Summary</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
