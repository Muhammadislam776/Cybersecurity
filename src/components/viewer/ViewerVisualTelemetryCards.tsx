import React from 'react';
import { 
  Server, 
  Radio, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Sparkles, 
  Zap,
  ArrowUpRight
} from 'lucide-react';

export const ViewerVisualTelemetryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Visual Card 1: Hyperscale Cloud Datacenter Infrastructure */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden group relative flex flex-col justify-between">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src="/images/datacenter_cloud_matrix.jpg"
            alt="Hyperscale Cloud Datacenter Infrastructure Operations"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>CLOUD NOC // 12 REGIONS</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
            <span className="text-slate-300">CORE AVAILABILITY:</span>
            <span className="text-emerald-400 font-bold">99.99% UPTIME</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>Infrastructure Health</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Continuous synthetic probes monitor API gateways, Redis cache clusters, and Kubernetes worker nodes in real-time.
          </p>
        </div>
      </div>

      {/* Visual Card 2: Global Satellite Threat Radar */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden group relative flex flex-col justify-between">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src="/images/global_threat_radar.jpg"
            alt="Global Cyber Threat Telemetry Radar Network"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-blue-500/40 rounded px-2 py-0.5 text-[10px] font-mono text-blue-300 flex items-center gap-1.5 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>ORBITAL RADAR: ACTIVE</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
            <span className="text-slate-300">GLOBAL SENSORS:</span>
            <span className="text-amber-400 font-bold">14,832 NODES</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Worldwide Threat Radar</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Aggregates live cross-continental ingress signals to detect DDoS storms and unauthorized credential attacks instantly.
          </p>
        </div>
      </div>

      {/* Visual Card 3: 24/7 Security Operations Command Post */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden group relative flex flex-col justify-between">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src="/images/soc_command_center.jpg"
            alt="CyberOps 24/7 Security Operations Command Post"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 rounded px-2 py-0.5 text-[10px] font-mono text-emerald-300 flex items-center gap-1.5 shadow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOC TELEMETRY: 14,240 EPS</span>
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white">
            <span className="text-slate-300">INGESTION INTEGRITY:</span>
            <span className="text-emerald-400 font-bold">0.00% LOSS</span>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autonomous SOC Command</span>
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Tier-2 security engineers and human-controlled AI models actively triage alerts under immutable audit governance.
          </p>
        </div>
      </div>
    </div>
  );
};
