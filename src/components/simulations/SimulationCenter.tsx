import React, { useState } from 'react';
import { 
  PlayCircle, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  UserCheck, 
  Clock, 
  Activity,
  ArrowRight,
  Terminal,
  StopCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { SecurityBadge } from '../common/SecurityBadge';
import { SimulationScenario } from '../../types';

export const SimulationCenter: React.FC = () => {
  const { 
    simulations, 
    startSimulation, 
    stopSimulation, 
    isSimulationActive, 
    activeSimulationId,
    incidents,
    navigateToIncident
  } = useApp();

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(simulations[0]);

  const activeSimulation = simulations.find(s => s.id === activeSimulationId);

  return (
    <div className="space-y-6">
      {/* Cyber Range Simulation Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-900/60 bg-slate-950 shadow-xl group">
        <div className="absolute inset-0">
          <img 
            src="/images/cyber_range_simulation.jpg" 
            alt="Cyber Range Simulation Arena" 
            className="w-full h-full object-cover opacity-30 group-hover:scale-105 group-hover:opacity-35 transition-all duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-amber-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                CYBER RANGE SANDBOX MODE
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                PROD ISOLATION: 100% AIR-GAPPED
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Interactive Attack Simulation & Drill Arena
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Exercise end-to-end CSIRT playbooks, validate AI diagnostics, and drill response commander decision-making against synthetic high-severity attack scenarios with zero production risk.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                MITRE ATT&CK Matrix Mapped
              </span>
              <span>&bull;</span>
              <span>Synthetic Packet Generator Ready</span>
              <span>&bull;</span>
              <span>Scorecard Auto-Audit</span>
            </div>
          </div>

          <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 shrink-0">
            {isSimulationActive ? (
              <div className="flex flex-col items-end gap-2">
                <div className="px-3 py-1 rounded-md bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold animate-pulse">
                  DRILL ACTIVE: {activeSimulation?.name || 'Simulated Scenario'}
                </div>
                <button
                  onClick={stopSimulation}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <StopCircle className="w-4 h-4" />
                  <span>Terminate Active Drill</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-start lg:items-end gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Sandbox Engine Ready</span>
                </div>
                <span className="text-[11px] text-slate-400">Select scenario below to launch</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Simulation Workflow Progression */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Standard Simulated Incident Lifecycle Workflow
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          {[
            { step: '1. Select Scenario', desc: 'Choose threat model' },
            { step: '2. Generate Telemetry', desc: 'Mock sensor alerts' },
            { step: '3. Create Incident', desc: 'Declare tracked ticket' },
            { step: '4. AI Analysis', desc: 'Observe & Synthesize' },
            { step: '5. Diagnostics', desc: 'Recommend safe steps' },
            { step: '6. Human Approval', desc: 'Commander sign-off' },
            { step: '7. Safe Resolution', desc: 'Immutable audit log' },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block text-[11px]">{item.step}</span>
              <span className="text-[10px] text-slate-400 block">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {simulations.map((scenario) => {
          const isSelected = selectedScenario.id === scenario.id;
          const isCurrentActive = isSimulationActive && activeSimulationId === scenario.id;

          return (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`p-5 rounded-xl border transition-all cursor-pointer space-y-4 ${
                isCurrentActive
                  ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-400'
                  : isSelected
                  ? 'border-blue-500 bg-blue-50/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {scenario.category}
                    </span>
                    <Badge variant="severity" severity={scenario.severity} size="sm">
                      {scenario.severity}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{scenario.name}</h3>
                </div>

                {isCurrentActive && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-500 text-white animate-pulse">
                    Running
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{scenario.description}</p>

              {/* Symptoms */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Simulated Symptoms:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-xs text-slate-600">
                  {scenario.symptoms.map((sym, sIdx) => (
                    <li key={sIdx}>{sym}</li>
                  ))}
                </ul>
              </div>

              {/* Launch / Active Button */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {scenario.mockAlerts.length} Simulated Alerts
                </span>

                {isCurrentActive ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      stopSimulation();
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Stop Simulation
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startSimulation(scenario.id);
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Launch Scenario</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
