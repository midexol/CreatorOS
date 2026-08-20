# CreatorOS 🚀
> **Creative Minds Jam #1 Submission** | Powered by [Minds by Animoca Brands](https://hellominds.ai)

CreatorOS is an autonomous multi-agent AI Chief of Staff for digital creators. It orchestrates trend discovery, content repurposing across platforms, and continuous performance memory feedback loops.

---

## 🤖 AI Agent Directive Guide
If you are an AI Coding Agent or Subagent working on this repository, read **[AGENT.md](./AGENT.md)** for full architecture, memory schemas, code maps, and execution rules.

---

## 📌 Project Documentation & Role Breakdown
For detailed technical spec, agent architecture, and the 5-person role allocation guide, read:
👉 **[PROJECT_SPEC_AND_ROLES.md](./PROJECT_SPEC_AND_ROLES.md)**

---

## 🔌 Real posting setup (Zernio)

Connections and publishing go through [Zernio](https://zernio.com), a hosted social API — it handles OAuth with each platform itself, so there's no separate developer app to register or get approved with X, LinkedIn, or YouTube. Free tier covers your first 2 connected accounts.

Without this set up, the app still runs fine — `/dashboard/connections` shows a clear "not configured" notice and nothing pretends to publish.

**1. Get a Zernio API key**
- Sign up free at [zernio.com](https://zernio.com/signup) — no card required
- Go to Settings → API Keys → Create API Key, copy it immediately (shown once)

**2. Get a profile ID**
- Every account starts with a default profile. Grab its ID:
  ```bash
  curl https://zernio.com/api/v1/profiles -H "Authorization: Bearer sk_your_key"
  ```
- Or create a new one:
  ```bash
  curl -X POST https://zernio.com/api/v1/profiles \
    -H "Authorization: Bearer sk_your_key" -H "Content-Type: application/json" \
    -d '{"name": "CreatorOS"}'
  ```

**3. Set environment variables in Vercel**
- Project Settings → Environment Variables:
  - `ZERNIO_API_KEY` = your key from step 1
  - `ZERNIO_PROFILE_ID` = the `_id` from step 2
- Redeploy after adding them (env vars only apply to new deployments)

**4. Test locally**
`vite preview` alone won't run the `/api` functions — use `vercel dev` instead (or just test against your Vercel deployment) to exercise the real Connect → OAuth redirect → Publish flow.

The three endpoints live in `api/zernio/` (`connect.ts`, `accounts.ts`, `posts.ts`) — thin proxies that hold the API key server-side and forward to Zernio's REST API. Frontend usage is in `src/lib/zernio.ts` and wired through `DashboardContext`.

**Known gap:** engagement metrics after a real publish are still simulated (`analyticsAgent.recordPostMetrics`) — polling Zernio's real analytics endpoint to replace that is separate follow-up work, not wired in yet.

---
1. **Minds Integration Depth**: Built with native Minds Agent skills and tool-calling delegation.
2. **Persistence Loop**: Uses multi-session memory namespaces (`creator.profile`, `growth.opportunities`, `content.drafts`, `analytics.performance_history`) to continuously adapt behavior.
3. **Creator-Economy Problem Fit**: Directly tackles creator burnout, audience retention, and multi-platform distribution.
4. **5-Person Developer Team Split**: Dedicated roles across Team Lead/Coordinator, Growth Agent, Content Agent, Analytics/Persistence, and Frontend UI/Demo Video Lead.

---

## 👥 5-Person Team Roles Summary
* **Person 1 (YOU - Team Lead & Architect)**: Coordinator Agent & Minds Memory Router
* **Person 2 (Growth Dev)**: Growth & Trend Discovery Agent
* **Person 3 (Content Dev)**: Multi-Platform Content Repurposing Agent ✅ Done
* **Person 4 (Analytics Dev)**: Social Integrations & Memory Persistence Feedback Loop
* **Person 5 (UI & Video Lead)**: Creator Dashboard UI & 1.5–2 Min Demo Video Lead

---

## 📄 License
MIT License
