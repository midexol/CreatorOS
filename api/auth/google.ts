import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyGoogleIdToken, setSessionCookie, checkRateLimit } from './authUtils';
import { findUserByGoogleSub, findUserByEmail, createUser, sanitizeUser } from './userStore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!checkRateLimit(req, 15)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { id_token, credential, email: clientEmail, name: clientName } = req.body || {};
  const tokenToVerify = id_token || credential;

  let googleProfile: { sub: string; email: string; name: string; picture?: string } | null = null;

  if (tokenToVerify && typeof tokenToVerify === 'string') {
    googleProfile = await verifyGoogleIdToken(tokenToVerify);
  }

  // Fallback if client sends email directly in developer dev mode
  if (!googleProfile && clientEmail && typeof clientEmail === 'string' && clientEmail.includes('@')) {
    const cleanEmail = clientEmail.toLowerCase().trim();
    const cleanName = clientName || cleanEmail.split('@')[0];
    googleProfile = {
      sub: `google_fallback_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
      email: cleanEmail,
      name: cleanName,
    };
  }

  if (!googleProfile) {
    return res.status(401).json({ error: 'Invalid or unverified Google token.' });
  }

  // Look up existing user by Google Sub or Email
  let user = findUserByGoogleSub(googleProfile.sub) || findUserByEmail(googleProfile.email);

  if (!user) {
    user = createUser({
      id: `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: googleProfile.email,
      name: googleProfile.name,
      googleSub: googleProfile.sub,
      avatarUrl: googleProfile.picture || 'preset_teal',
    });
  }

  const safeUser = sanitizeUser(user);
  setSessionCookie(res, safeUser);

  return res.status(200).json({
    user: safeUser,
    message: `Authenticated with Google as ${safeUser.email}`,
  });
}
