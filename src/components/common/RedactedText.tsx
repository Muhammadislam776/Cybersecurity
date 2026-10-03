import React, { useState } from 'react';
import { Lock, Info, Check, Copy } from 'lucide-react';
import { redactSecrets } from '../../utils/redaction';

interface RedactedTextProps {
  content: string;
  className?: string;
  mono?: boolean;
}

export const RedactedText: React.FC<RedactedTextProps> = ({ content, className = '', mono = true }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [copied, setCopied] = useState(false);
  const { redactedText, hasRedactions, redactedCount, detectedTypes } = redactSecrets(content);

  const handleCopy = () => {
    navigator.clipboard.writeText(redactedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {hasRedactions && (
        <div className="flex items-center justify-between bg-amber-50/80 border-b border-amber-200 px-3 py-1.5 text-xs text-amber-800 rounded-t-md">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Sensitive data redacted ({redactedCount} token{redactedCount > 1 ? 's' : ''} masked)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMetadata(!showMetadata)}
              type="button"
              className="text-amber-700 hover:text-amber-900 underline font-medium flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3 h-3" />
              {showMetadata ? 'Hide Token Details' : 'View Redaction Metadata'}
            </button>
            <button
              onClick={handleCopy}
              type="button"
              className="text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer ml-2"
              title="Copy safely redacted text"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {showMetadata && (
        <div className="bg-amber-100/70 border-b border-amber-200 p-2.5 text-xs text-amber-900">
          <div className="font-semibold mb-1">Redaction Guardrail Policy:</div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-800">
            {detectedTypes.map((t, idx) => (
              <li key={idx}>Detected pattern: <span className="font-mono font-medium">{t}</span> (Raw secret withheld per Zero-Exposure Policy)</li>
            ))}
          </ul>
        </div>
      )}

      <pre
        className={`p-3 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap select-text ${
          mono ? 'font-mono' : 'font-sans'
        } ${hasRedactions ? 'rounded-b-md' : 'rounded-md'} bg-slate-900 text-slate-100 ${className}`}
      >
        {redactedText}
      </pre>
    </div>
  );
};
