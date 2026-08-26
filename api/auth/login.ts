import type { VercelRequest, VercelResponse } from '@vercel/node';
import { comparePassword, setSessionCookie, checkRateLimit } from './authUtils';
import { findUserByEmail, sanitizeUser } from './userStore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!checkRateLimit(req, 10)) {
    return res.status(429).json({ error: 'Too many login attempts. Please try again later.' });
  }

  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid email or password.' });
  }

  const user = findUserByEmail(email);
  if (!user || !user.passwordHash) {
    // Generic error message to prevent account enumeration
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const safeUser = sanitizeUser(user);
  setSessionCookie(res, safeUser);

  return res.status(200).json({
    user: safeUser,
    message: `Signed in as ${safeUser.email}`,
  });
}
