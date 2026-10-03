export interface RedactionResult {
  redactedText: string;
  hasRedactions: boolean;
  redactedCount: number;
  detectedTypes: string[];
}

const REDACTION_PATTERNS: { type: string; regex: RegExp; replace: (match: string, ...groups: any[]) => string }[] = [
  // OpenAI / Stripe live secret keys
  {
    type: 'API Secret Key (sk_*)',
    regex: /\b((?:sk_live_|sk_test_|sk_mock_|sec_)[a-zA-Z0-9]{8,32})\b/g,
    replace: (match) => {
      const prefix = match.substring(0, 8);
      return `${prefix}************`;
    }
  },
  // GitHub Personal Access Token
  {
    type: 'GitHub Token (ghp_*)',
    regex: /\b(ghp_[a-zA-Z0-9]{16,36})\b/g,
    replace: (match) => {
      const prefix = match.substring(0, 4);
      return `${prefix}************`;
    }
  },
  // AWS Access Key ID
  {
    type: 'AWS Access Key',
    regex: /\b(AKIA[0-9A-Z]{16})\b/g,
    replace: (match) => `${match.substring(0, 4)}************`
  },
  // JWT tokens (Bearer eyJ...)
  {
    type: 'JSON Web Token (JWT)',
    regex: /\b(eyJ[a-zA-Z0-9_-]{8,}\.eyJ[a-zA-Z0-9_-]{8,}\.[a-zA-Z0-9_-]{8,})\b/g,
    replace: () => 'eyJhbGciOi...[REDACTED_JWT_TOKEN]...'
  },
  // Authorization: Bearer <token>
  {
    type: 'Bearer Authorization Header',
    regex: /(Authorization:\s*Bearer\s+)([A-Za-z0-9_\-\.]{15,})/gi,
    replace: (_match, prefix) => `${prefix}************[REDACTED]`
  },
  // Database connection passwords
  {
    type: 'Database Connection Secret',
    regex: /(postgres(?:ql)?:\/\/[a-zA-Z0-9_-]+:)([^@]+)(@[a-zA-Z0-9_.-]+)/gi,
    replace: (_match, prefix, _pwd, suffix) => `${prefix}********[REDACTED]${suffix}`
  },
  // Generic password assignments
  {
    type: 'Credential/Password Field',
    regex: /(["']?(?:password|passwd|db_password|api_secret|client_secret)["']?\s*[:=]\s*["'])([^"'\s]{4,})(["'])/gi,
    replace: (_match, prefix, _val, suffix) => `${prefix}************${suffix}`
  },
  // RSA / PEM Private Keys
  {
    type: 'Cryptographic Private Key',
    regex: /(-----BEGIN (?:RSA |EC )?PRIVATE KEY-----)([\s\S]*?)(-----END (?:RSA |EC )?PRIVATE KEY-----)/g,
    replace: () => '-----BEGIN PRIVATE KEY-----\n[REDACTED_CONFIDENTIAL_KEY_BLOCK]\n-----END PRIVATE KEY-----'
  }
];

export function redactSecrets(text: string): RedactionResult {
  if (!text) {
    return {
      redactedText: '',
      hasRedactions: false,
      redactedCount: 0,
      detectedTypes: []
    };
  }

  let result = text;
  let count = 0;
  const detectedTypes = new Set<string>();

  for (const pattern of REDACTION_PATTERNS) {
    const matches = result.match(pattern.regex);
    if (matches && matches.length > 0) {
      count += matches.length;
      detectedTypes.add(pattern.type);
      result = result.replace(pattern.regex, pattern.replace as any);
    }
  }

  return {
    redactedText: result,
    hasRedactions: count > 0,
    redactedCount: count,
    detectedTypes: Array.from(detectedTypes)
  };
}
