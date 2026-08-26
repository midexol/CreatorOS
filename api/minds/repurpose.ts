// ─────────────────────────────────────────────────────────────────────────────
// api/minds/repurpose.ts — Vercel serverless function for Minds Repurposing
// ─────────────────────────────────────────────────────────────────────────────

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMindsClient } from '@animocabrands/minds-client-lib';

const CONVERSATION_ALIAS = 'repurpose-main';
const REPLY_TIMEOUT_MS = 90_000;
const DEFAULT_MINDS_KEY = 'your_minds_builder_api_key_here';

function getClient() {
  const key = process.env.MINDS_BUILDER_API_KEY || DEFAULT_MINDS_KEY;
  return createMindsClient({ builderApiKey: key });
}

async function getMindId(client: ReturnType<typeof createMindsClient>): Promise<string> {
  const minds = await client.listMinds();
  if (!minds || minds.length === 0) {
    throw new Error('No Minds found on your account at build.hellominds.ai');
  }
  return minds[0]!.mindId;
}

function stripCodeFence(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced && fenced[1] ? fenced[1] : text;
}

function extractJsonObject(rawText: string): string {
  const source = stripCodeFence(rawText);
  const start = source.indexOf('{');
  if (start === -1) {
    throw new Error(`The Minds Agent reply had no JSON object in it.`);
  }

  let depth = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (char === '\\') { escapeNext = true; continue; }
    if (char === '"') { inString = !inString; continue; }
    if (inString) continue;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) return source.substring(start, i + 1);
    }
  }

  throw new Error(`The Minds Agent reply had an unterminated JSON object.`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { transcript, niche, angle } = req.body || {};

  if (!transcript) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    const client = getClient();
    const mindId = await getMindId(client);
    await client.ensureConversation(CONVERSATION_ALIAS, mindId);

    const prompt = `CREATOR NICHE: ${niche || 'Tech & AI Creator'}
TARGET ANGLE: ${angle ? angle.toUpperCase() : 'CONTRARIAN'}

TRANSCRIPT:
${transcript}

Please repurpose this into 3 platform-native content pieces following your instructions.
Return ONLY valid JSON with keys: adapted_from_memory, memory_insight, drafts (twitter, linkedin, youtube_shorts).`;

    await client.sendMessage({ alias: CONVERSATION_ALIAS, messageText: prompt });

    const outcome = await client.waitForReply({
      alias: CONVERSATION_ALIAS,
      timeoutMs: REPLY_TIMEOUT_MS,
    });

    if (outcome.timedOut) {
      return res.status(504).json({ error: 'Minds Agent response timed out.' });
    }

    const replyText = outcome.reply?.messageText || '';
    const jsonText = extractJsonObject(replyText);
    const result = JSON.parse(jsonText);

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Minds API call failed' });
  }
}
