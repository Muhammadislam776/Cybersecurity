import React, { useState } from 'react';
import { AnalystCommandHeader } from './AnalystCommandHeader';
import { AnalystKpiHud } from './AnalystKpiHud';
import { AnalystIncidentQueue } from './AnalystIncidentQueue';
import { AnalystTelemetryVisualizer } from './AnalystTelemetryVisualizer';
import { AnalystAlertTriageFeed } from './AnalystAlertTriageFeed';
import { AnalystIocWatchlist } from './AnalystIocWatchlist';
import { AnalystAiTriageDrawer } from './AnalystAiTriageDrawer';
import { AnalystDiagnosticModal } from './AnalystDiagnosticModal';
import { AnalystIncidentInspectorModal } from './AnalystIncidentInspectorModal';
import { Incident } from '../../types';

export const AnalystCommandCenter: React.FC = () => {
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [selectedIncidentForTriage, setSelectedIncidentForTriage] = useState<Incident | null>(null);
  const [selectedIncidentForDiagnostic, setSelectedIncidentForDiagnostic] = useState<Incident | null>(null);
  const [inspectingIncident, setInspectingIncident] = useState<Incident | null>(null);

  const handleOpenAiForIncident = (incident: Incident) => {
    setSelectedIncidentForTriage(incident);
    setIsAiCopilotOpen(true);
  };

  const handleOpenDiagnosticForIncident = (incident: Incident) => {
    setSelectedIncidentForDiagnostic(incident);
    setIsDiagnosticModalOpen(true);
  };

  const handleInspectIncident = (incident: Incident) => {
    setInspectingIncident(incident);
  };

  const handleScrollToIoc = () => {
    const el = document.getElementById('analyst-ioc-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAlerts = () => {
    const el = document.getElementById('analyst-alerts-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Tactical Command Header */}
      <AnalystCommandHeader
        onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
        onOpenDiagnosticModal={() => setIsDiagnosticModalOpen(true)}
        onScrollToIoc={handleScrollToIoc}
        onScrollToAlerts={handleScrollToAlerts}
      />

      {/* 2. High-Density SecOps KPI HUD */}
      <AnalystKpiHud />

      {/* 3. Priority Incident Investigation Queue */}
      <AnalystIncidentQueue
        onInspectIncident={handleInspectIncident}
        onTriageWithAi={handleOpenAiForIncident}
        onQueueDiagnostic={handleOpenDiagnosticForIncident}
      />

      {/* 4. 24-Hour Telemetry Volume & MITRE ATT&CK Matrix Mapping */}
      <AnalystTelemetryVisualizer />

      {/* 5. Real-Time Alert Triage Stream */}
      <AnalystAlertTriageFeed />

      {/* 6. Extracted IOC Threat Watchlist */}
      <AnalystIocWatchlist />

      {/* Modals & Drawers */}
      <AnalystAiTriageDrawer
        isOpen={isAiCopilotOpen}
        onClose={() => {
          setIsAiCopilotOpen(false);
          setSelectedIncidentForTriage(null);
        }}
        selectedIncident={selectedIncidentForTriage}
      />

      <AnalystDiagnosticModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => {
          setIsDiagnosticModalOpen(false);
          setSelectedIncidentForDiagnostic(null);
        }}
        targetIncident={selectedIncidentForDiagnostic}
      />

      <AnalystIncidentInspectorModal
        incident={inspectingIncident}
        onClose={() => setInspectingIncident(null)}
        onOpenAiTriage={(inc) => {
          setInspectingIncident(null);
          handleOpenAiForIncident(inc);
        }}
        onOpenDiagnostic={(inc) => {
          setInspectingIncident(null);
          handleOpenDiagnosticForIncident(inc);
        }}
      />
    </div>
  );
};
