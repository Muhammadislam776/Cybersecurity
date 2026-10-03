import React from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary' | 'success';
  requiresReason?: boolean;
  reasonValue?: string;
  onReasonChange?: (val: string) => void;
  auditNotice?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'warning',
  requiresReason = false,
  reasonValue = '',
  onReasonChange,
  auditNotice = 'This action will be permanently recorded in the immutable audit log.'
}) => {
  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  const buttonClasses = isDanger 
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : isWarning
    ? 'bg-orange-600 hover:bg-orange-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-full shrink-0 ${isDanger ? 'bg-red-100 text-red-600' : isWarning ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
            {isDanger || isWarning ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
          </div>
        </div>

        {requiresReason && (
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Operational Justification / Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              value={reasonValue}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder="State the reason for this action (recorded in audit ledger)..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>
        )}

        {auditNotice && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{auditNotice}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={requiresReason && !reasonValue.trim()}
            className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
