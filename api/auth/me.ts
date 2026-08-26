import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthenticatedUser } from './authUtils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Derive user ONLY from request-scoped HTTP-Only session cookie
  const user = getAuthenticatedUser(req);

  if (!user) {
    return res.status(401).json({ authenticated: false, user: null });
  }

  return res.status(200).json({
    authenticated: true,
    user,
  });
}
