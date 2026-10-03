import React from 'react';
import { 
  BrainCircuit, 
  ShieldCheck, 
  Info, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  Cpu,
  Layers
} from 'lucide-react';

export const ViewerAiInsights: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Automated Threat & Anomaly Synthesis
              </h3>
              <span className="font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                v2.4 Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Real-time machine correlation across multi-source security signals</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <Lock className="w-3 h-3 text-slate-500" />
          READ-ONLY ADVISORY
        </span>
      </div>

      {/* Required Disclaimer Banner */}
      <div className="mx-4 mt-4 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          AI Generated — For Information Only
        </span>
        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          Zero-Execution Guardrail
        </span>
      </div>

      {/* AI Operational Summary Body */}
      <div className="p-4 space-y-3.5">
        <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>SYNTHESIZED SITUATION REPORT</span>
            <span>CONFIDENCE: 94.8%</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            "Three high-severity alerts were detected in the Payment API during the last hour. Current investigation status indicates service degradation rather than a complete outage. Primary anomaly correlates with database read-replica lag exceeding 450ms."
          </p>
        </div>

        {/* Diagnostic Observations */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Correlated Telemetry Findings
          </span>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Egress Perimeter Clear:</span>
                <span className="text-slate-600 ml-1">No unauthorized outbound beacons or cross-tenant exfiltration identified.</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Approved Playbook Match:</span>
                <span className="text-slate-600 ml-1">RB-102 (Database Connection Pool Saturation Recovery Playbook).</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Guardrail Note */}
      <div className="px-5 py-2.5 bg-slate-50/70 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center justify-between">
        <span>AI assists with situational synthesis only; changes require human approval.</span>
        <span className="font-mono text-[10px] text-slate-400">SOC-SecOps-Model-v2</span>
      </div>
    </div>
  );
};
