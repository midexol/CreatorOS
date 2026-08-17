# AGENT.md — CreatorOS AI Agent Directive & Context Guide

> **Target Audience**: AI Coding Assistants, Subagents, and Developers working on CreatorOS.  
> **Goal**: Read this file to immediately understand project context, system architecture, team boundaries, data schemas, and execution guidelines.

---

## 🚀 1. Project Overview & Hackathon Brief

* **Project Name**: CreatorOS
* **Event**: Creative Minds Jam #1 (by Minds by Animoca Brands & Open Campus)
* **Track**: Content Repurposing (primary) / Creator Economy
* **Key Platform**: [Minds by Animoca Brands](https://hellominds.ai)
* **Core Concept**: Multi-agent AI Chief of Staff for digital creators that automates trend discovery, content repurposing across X/LinkedIn/YouTube Shorts, and runs an autonomous performance feedback loop.

### 🏆 Winning Criteria Matrix (What We Must Deliver):
1. **Minds Integration Depth**: Built natively with Minds Agent skills, tool-calling delegation, and cognition credits.
2. **Persistence Demonstration**: The agent MUST demonstrate multi-session memory continuity (`analytics.performance_history` -> memory read -> adapted hook generation).
3. **Creator-Economy Problem Fit**: Solves creator burnout, audience retention, and cross-platform distribution.
4. **Execution & Completeness**: Functional product dashboard + 1.5–2 minute video demo.

---

## 👥 2. 5-Person Team Execution & Ownership Boundaries

When modifying code or creating features, respect team member ownership:

| Developer | Role & Ownership | Scope / Key Files |
| :--- | :--- | :--- |
| **Person 1 (Lead / YOU)** | Architect & Minds Coordinator Lead | `src/agents/coordinatorAgent.ts`, `creator.profile` memory, repo architecture |
| **Person 2** | Growth & Trend Discovery Agent Dev | `src/agents/growthAgent.ts`, `growth.opportunities` memory, trend polling APIs |
| **Person 3** | Content Repurposing Agent Dev | `src/agents/contentAgent.ts`, `content.drafts` memory, multi-platform prompts |
| **Person 4** | Analytics & Persistence Loop Dev | `src/agents/analyticsAgent.ts`, `analytics.performance_history` memory, social metrics |
| **Person 5** | Frontend Dashboard & Demo Video Lead | `src/App.tsx`, `src/components/*`, UI polish, 1.5–2 min demo video |

---

## 🧠 3. Shared Minds Memory Schema & Namespaces

All agents MUST read and write state using standardized memory keys managed via `src/memory/mindsStore.ts`:

```typescript
// Namespace 1: creator.profile (Owned by Person 1)
{
  "name": "Alex DevCreator",
  "niche": "AI Engineering & Creator Tools",
  "brandVoice": "Informative, high-signal, punchy, developer-centric",
  "targetAudience": "Indie hackers, AI builders & content creators",
  "cognitionCredits": 1450
}

// Namespace 2: growth.opportunities (Written by Person 2 -> Read by Person 3)
{
  "id": "opp_1",
  "topic": "Autonomous AI Agent Memory & Multi-Session State",
  "source": "Reddit r/LocalLLaMA & X Trends",
  "opportunityScore": 96, // 1-100 score
  "angle": "Why persistent memory is the boundary separating chatbot toys from true production agents",
  "category": "AI",
  "timestamp": "10 mins ago"
}

// Namespace 3: content.drafts (Written by Person 3 -> Approved by Person 5 / Dashboard)
{
  "id": "draft_1",
  "opportunityId": "opp_1",
  "platform": "twitter", // 'twitter' | 'linkedin' | 'youtube_shorts'
  "hook": "AI agents without memory are glorified search bars.",
  "body": "Here is how persistent multi-session state changes everything...",
  "cta": "What memory architecture are you using for your agents?",
  "status": "pending_approval", // 'pending_approval' | 'published'
  "predictedPerformanceScore": 94
}

// Namespace 4: analytics.performance_history (Written by Person 4 -> Read by Person 3 for Persistence Loop!)
{
  "postId": "post_101",
  "platform": "twitter",
  "hookStyle": "Contrarian Bold Statement",
  "views": 24500,
  "engagementRate": 8.6,
  "insight": "Contrarian hooks performed +36% higher than generic questions. Saved to memory."
}
```

---

## 📁 4. Repository Code Map

```
CreatorOS/
├── AGENT.md                      # <--- THIS FILE (AI Agent Context Directive)
├── PROJECT_SPEC_AND_ROLES.md     # Detailed 5-Person Spec & Data Contracts
├── README.md                     # Public GitHub Repository Landing Page
├── package.json                  # Dependencies (React, TypeScript, Vite, Tailwind)
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite dev server configuration (Port 3000)
├── index.html                    # Entry HTML with Outfit & Plus Jakarta Sans Google Fonts
└── src/
    ├── main.tsx                  # React entry root
    ├── index.css                 # Custom glassmorphic styling & keyframe animations
    ├── App.tsx                   # Main CreatorOS Dashboard Application
    ├── types/
    │   └── index.ts              # Core TypeScript interfaces (Platform, Draft, Metric, etc.)
    ├── memory/
    │   └── mindsStore.ts         # Central Minds Memory State Store with localStorage persistence
    ├── agents/
    │   ├── coordinatorAgent.ts   # Person 1: Central router & tool call delegation
    │   ├── growthAgent.ts        # Person 2: Trend polling & opportunity scoring algorithm
    │   ├── contentAgent.ts       # Person 3: Content repurposing & performance memory reader
    │   └── analyticsAgent.ts     # Person 4: Social metric logger & memory persistence writer
    └── components/
        ├── Navbar.tsx            # Header with Minds Cognition counter & role modal trigger
        ├── DelegationTrace.tsx   # Live visualizer of Coordinator -> Sub-agent tool calls
        ├── GrowthTab.tsx         # Trend discovery cards & scoring feed
        ├── ContentTab.tsx        # Multi-platform draft generator & approval station
        ├── AnalyticsTab.tsx      # Persistence Demonstration dashboard & memory log
        ├── MemoryInspector.tsx   # Live JSON viewer for Minds memory namespaces
        └── TeamRolesModal.tsx    # Interactive 5-person role viewer modal
```

---

## ⚙️ 5. Rules & Execution Directives for AI Agents

When modifying this repository, follow these mandatory guidelines:

1. **Preserve Memory Persistence Proof**: Never bypass or remove the memory read/write loop between `analyticsAgent.ts` and `contentAgent.ts`. This persistence demonstration is essential for winning the hackathon.
2. **Strict Data Contract Alignment**: Do not mutate field names in `src/types/index.ts` without updating `mindsStore.ts` and all agent implementations.
3. **UI Aesthetics Matter**: Always maintain the dark glassmorphic design system (`#080C14` background, slate borders, neon blue `#3B82F6`, purple `#8B5CF6`, emerald `#10B981` accents).
4. **Git Identity Rule**: Never override global git user settings with placeholder names or emails. Commit using the active default git configuration.
5. **Verification**: Always run `npm run build` to verify TypeScript compilation before declaring task completion.

---

## ⚡ Quick Reference Commands

```bash
# Run local dev server (http://localhost:3000)
npm run dev

# Verify TypeScript compilation and production build
npm run build
```
