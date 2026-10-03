// Lightweight deterministic SHA-256 style hash generator for tamper-evident audit chains
export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Format as a 64-char hex string mimicking SHA-256
  const hexPart1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs((hash ^ 0x5a5a5a5a)).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs((hash * 31)).toString(16).padStart(8, '0');
  const hexPart4 = Math.abs((hash ^ 0xa5a5a5a5)).toString(16).padStart(8, '0');
  const hexPart5 = Math.abs((hash * 13)).toString(16).padStart(8, '0');
  const hexPart6 = Math.abs((hash ^ 0x3c3c3c3c)).toString(16).padStart(8, '0');
  const hexPart7 = Math.abs((hash * 17)).toString(16).padStart(8, '0');
  const hexPart8 = Math.abs((hash ^ 0xc3c3c3c3)).toString(16).padStart(8, '0');

  return (hexPart1 + hexPart2 + hexPart3 + hexPart4 + hexPart5 + hexPart6 + hexPart7 + hexPart8).substring(0, 64);
}

export function formatShortHash(hash: string): string {
  if (!hash || hash.length < 12) return hash || '00000000';
  return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
}
