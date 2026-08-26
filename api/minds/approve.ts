// ─────────────────────────────────────────────────────────────────────────────
// api/minds/approve.ts — Send approval feedback to Minds conversation thread
// ─────────────────────────────────────────────────────────────────────────────

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMindsClient } from '@animocabrands/minds-client-lib';

const CONVERSATION_ALIAS = 'repurpose-main';
const DEFAULT_MINDS_KEY = 'your_minds_builder_api_key_here';

function getClient() {
  const key = process.env.MINDS_BUILDER_API_KEY || DEFAULT_MINDS_KEY;
  return createMindsClient({ builderApiKey: key });
}

async function getMindId(client: ReturnType<typeof createMindsClient>): Promise<string> {
  const minds = await client.listMinds();
  if (!minds || minds.length === 0) {
    throw new Error('No Minds found on your account');
  }
  return minds[0]!.mindId;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { platform, hookStyle, hook } = req.body || {};

  try {
    const client = getClient();
    const mindId = await getMindId(client);

    await client.ensureConversation(CONVERSATION_ALIAS, mindId);

    const feedbackMessage =
      `APPROVED: The creator liked the ${String(platform).toUpperCase()} draft.\n` +
      `Hook style used: ${hookStyle || 'Contrarian'}\n` +
      `Hook text: "${hook}"\n` +
      `Remember this preference for future repurposing sessions.`;

    await client.sendMessage({
      alias: CONVERSATION_ALIAS,
      messageText: feedbackMessage,
    });

    return res.status(200).json({ success: true, message: 'Approval recorded in Minds memory' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Minds approval feedback failed' });
  }
}
