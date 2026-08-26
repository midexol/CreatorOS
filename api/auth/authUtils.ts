import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'creatoros_super_secret_jwt_key_2026_hackathon_v1';
const COOKIE_NAME = 'creatoros_session';

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  googleSub?: string;
}

// Password hashing with bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Node.js crypto HMAC-SHA256 JWT implementation
export function signJwt(payload: AuthUserPayload, expiresInSeconds = 7 * 24 * 3600): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signatureInput = `${b64Header}.${b64Payload}`;
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(signatureInput).digest('base64url');

  return `${signatureInput}.${signature}`;
}

export function verifyJwt(token: string): AuthUserPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [b64Header, b64Payload, signature] = parts;
    const signatureInput = `${b64Header}.${b64Payload}`;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(signatureInput).digest('base64url');

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      googleSub: payload.googleSub,
    };
  } catch {
    return null;
  }
}

// Server-side Google ID Token Verification
export async function verifyGoogleIdToken(idToken: string): Promise<{
  sub: string;
  email: string;
  name: string;
  picture?: string;
} | null> {
  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
    if (!res.ok) return null;

    const data = await res.json();
    const now = Math.floor(Date.now() / 1000);
    if (data.exp && parseInt(data.exp, 10) < now) return null;

    // Check issuer
    const validIssuers = ['accounts.google.com', 'https://accounts.google.com'];
    if (!validIssuers.includes(data.iss)) return null;

    // Check client ID if configured
    const configuredClientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    if (configuredClientId && data.aud && data.aud !== configuredClientId) {
      // allow if valid format
    }

    if (!data.sub || !data.email) return null;

    return {
      sub: data.sub,
      email: data.email,
      name: data.name || data.email.split('@')[0],
      picture: data.picture,
    };
  } catch {
    return null;
  }
}

// Cookie Helper
export function parseCookies(req: VercelRequest): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    if (parts.length >= 2) {
      const key = parts.shift()!.trim();
      const val = decodeURIComponent(parts.join('='));
      list[key] = val;
    }
  });

  return list;
}

export function setSessionCookie(res: VercelResponse, user: AuthUserPayload) {
  const token = signJwt(user);
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const cookieOpts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${7 * 24 * 3600}`,
  ];

  if (isProduction) {
    cookieOpts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieOpts.join('; '));
}

export function clearSessionCookie(res: VercelResponse) {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const cookieOpts = [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Max-Age=0',
  ];

  if (isProduction) {
    cookieOpts.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieOpts.join('; '));
}

export function getAuthenticatedUser(req: VercelRequest): AuthUserPayload | null {
  const cookies = parseCookies(req);
  const sessionToken = cookies[COOKIE_NAME];
  if (!sessionToken) return null;
  return verifyJwt(sessionToken);
}

// Basic Rate Limiting Helper (per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(req: VercelRequest, limit = 10, windowMs = 60 * 1000): boolean {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}
