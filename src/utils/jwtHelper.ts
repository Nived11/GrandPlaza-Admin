function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
  const binary = atob(pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifyJwtRole(token: string): Promise<string | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const secretKey =
      process.env.JWT_SECRET_KEY ||
      process.env.DJANGO_SECRET_KEY ||
      process.env.SECRET_KEY;

    // Fail closed if no signing key is configured
    if (!secretKey) {
      return null;
    }

    // Validate algorithm and type in header
    const headerBytes = base64UrlToUint8Array(headerB64);
    const headerStr = new TextDecoder().decode(headerBytes as any);
    const header = JSON.parse(headerStr);
    if (header.alg !== 'HS256' || header.typ !== 'JWT') {
      return null;
    }

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToUint8Array(sigB64);
    const dataBytes = enc.encode(`${headerB64}.${payloadB64}`);

    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes as any, dataBytes as any);
    if (!isValid) return null;

    const payloadBytes = base64UrlToUint8Array(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes as any);
    const payload = JSON.parse(payloadStr);

    // Enforce required, finite expiry
    if (!payload.exp || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp) || Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload?.role ?? null;
  } catch {
    return null;
  }
}

// Backward-compatible fallback for non-crypto contexts
export const decodeJwtRole = (token: string): string | null => {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payloadBytes = base64UrlToUint8Array(parts[1]);
    const payloadStr = new TextDecoder().decode(payloadBytes as any);
    const payload = JSON.parse(payloadStr);
    if (!payload.exp || typeof payload.exp !== 'number' || Date.now() >= payload.exp * 1000) {
      return null;
    }
    return payload?.role ?? null;
  } catch {
    return null;
  }
};
