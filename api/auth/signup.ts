import type { VercelRequest, VercelResponse } from '@vercel/node';
import { hashPassword, setSessionCookie, checkRateLimit } from './authUtils';
import { findUserByEmail, createUser, sanitizeUser } from './userStore';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!checkRateLimit(req, 10)) {
    return res.status(429).json({ error: 'Too many signup attempts. Please try again later.' });
  }

  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email,
    name: name.trim(),
    passwordHash,
    avatarUrl: 'preset_amber',
  });

  const safeUser = sanitizeUser(user);
  setSessionCookie(res, safeUser);

  return res.status(201).json({
    user: safeUser,
    message: 'Account created successfully',
  });
}
