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
      process.env.SECRET_KEY ||
      'django-insecure-5t=7)&fav4_i&o!*ftlu^1#s$xx*fk1q4a!94r$&t+hn4pz=s2';

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

    if (payload.exp && Date.now() >= payload.exp * 1000) {
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
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload?.role ?? null;
  } catch {
    return null;
  }
};
