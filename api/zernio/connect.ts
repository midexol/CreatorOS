import type { VercelRequest, VercelResponse } from '@vercel/node';

// Proxies Zernio's "get connect URL" step. The frontend redirects the
// browser to the returned authUrl — Zernio hosts the OAuth exchange with
// the platform itself, so no per-platform developer app is needed here.
// Docs: https://docs.zernio.com/ (Step 2: Connect a Social Account)

const ZERNIO_BASE = 'https://zernio.com/api/v1';
const DEFAULT_ZERNIO_KEY = 'sk_your_zernio_api_key_here';
const DEFAULT_ZERNIO_PROFILE = '6a8ec77a55ec22df19941e10';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.ZERNIO_API_KEY || DEFAULT_ZERNIO_KEY;
  const profileId = process.env.ZERNIO_PROFILE_ID || DEFAULT_ZERNIO_PROFILE;

  const platform = req.query.platform;
  if (!platform || typeof platform !== 'string') {
    res.status(400).json({ error: 'bad_request', message: 'platform query param is required' });
    return;
  }

  try {
    const zernioRes = await fetch(
      `${ZERNIO_BASE}/connect/${encodeURIComponent(platform)}?profileId=${encodeURIComponent(profileId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const data = await zernioRes.json();
    if (!zernioRes.ok) {
      res.status(zernioRes.status).json(data);
      return;
    }
    res.status(200).json({ authUrl: data.authUrl });
  } catch (err) {
    res.status(502).json({ error: 'upstream_error', message: 'Could not reach Zernio' });
  }
}
