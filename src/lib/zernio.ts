import { Platform } from '../types';

const ZERNIO_PLATFORM: Record<Platform, string> = {
  twitter: 'twitter',
  linkedin: 'linkedin',
  youtube_shorts: 'youtube',
  youtube_longform: 'youtube',
};

export interface ZernioAccount {
  _id: string;
  platform: string;
  username?: string;
  displayName?: string;
}

export class NotConfiguredError extends Error {}

async function parseOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) throw new NotConfiguredError(data.message || 'Zernio is not configured yet');
  if (!res.ok) {
    const errorMsg = data.error || data.message || `Request failed (${res.status})`;
    throw new Error(errorMsg);
  }
  return data;
}

export async function getConnectUrl(platform: Platform): Promise<string> {
  const res = await fetch(`/api/zernio/connect?platform=${ZERNIO_PLATFORM[platform]}`);
  const data = await parseOrThrow(res);
  return data.authUrl as string;
}

export async function listAccounts(): Promise<ZernioAccount[]> {
  const res = await fetch('/api/zernio/accounts');
  const data = await parseOrThrow(res);
  return (data.accounts || []) as ZernioAccount[];
}

export async function disconnectAccount(accountId: string): Promise<void> {
  const res = await fetch(`/api/zernio/accounts?accountId=${encodeURIComponent(accountId)}`, {
    method: 'DELETE',
  });
  await parseOrThrow(res);
}

export async function publishPost(content: string, platform: Platform, accountId: string) {
  const res = await fetch('/api/zernio/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      publishNow: true,
      platforms: [{ platform: ZERNIO_PLATFORM[platform], accountId }],
    }),
  });
  return parseOrThrow(res);
}

export function zernioPlatformFor(platform: Platform): string {
  return ZERNIO_PLATFORM[platform];
}
