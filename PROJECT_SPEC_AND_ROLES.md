# CreatorOS — Creative Minds Jam #1
## Team Role Allocation & Technical Execution Plan (5-Person Team)

---

### Executive Overview & Winning Strategy
**CreatorOS** is an autonomous multi-agent system built natively on **Minds by Animoca Brands** (`hellominds.ai`). It serves as an AI Chief of Staff for digital creators, combining trend monitoring, multi-platform content generation/repurposing, and automated performance feedback loops.

#### Winning the Hackathon Criteria:
1. **Minds Integration Depth (Score 10/10)**: Uses native Minds Skills, tool-calling delegation, and multi-agent memory namespaces (`creator.profile`, `growth.opportunities`, `content.drafts`, `analytics.performance_history`).
2. **Persistence Demonstration (Score 10/10)**: Demonstrates true memory continuity across sessions—the Analytics Agent writes engagement data back into Minds memory, which directly changes how the Content Agent crafts future posts.
3. **Creator-Economy Problem Fit (Score 10/10)**: Solves creator burnout, audience retention, and cross-platform growth.
4. **Execution & Completeness**: Functional working product, interactive dashboard, and tight 1.5–2 min video demo.

---

## 👥 5-Person Role Breakdown

---

### 👤 PERSON 1: Team Lead / Lead Architect & Minds Coordinator (YOU)
> **Mission**: Build the core Minds Coordinator Agent, manage system architecture & memory schema, orchestrate multi-agent delegation, and oversee project delivery.

#### 🎯 Key Responsibilities:
- **Minds Platform & Cognition Setup**: Set up the main Mind on `hellominds.ai` and apply the hackathon cognition boost.
- **Coordinator Routing Logic**: Build the central orchestrator agent that receives creator goals (e.g., *"Help me grow my Tech YouTube channel this week"*), interprets intent, and delegates tasks to sub-agents via tool calling.
- **Memory Schema & Namespace Management**: Define and maintain shared Minds memory keys:
  - `creator.profile` (Creator voice, target audience, preferred platforms, goals)
  - `system.delegation_trace` (Logs of agent-to-agent interactions)
- **Repo & Integration Oversight**: Maintain central codebase standards, API contracts, `README.md`, and technical architecture documentation required for submission.

#### 📦 Deliverables & Dependencies:
- **Inputs**: High-level intent / goals from Frontend Dashboard (Person 5).
- **Outputs**: Delegated commands to Growth (Person 2) & Content (Person 3) agents; combined executive summary back to Dashboard.
- **Dependencies**: Ships baseline schema on Day 1 so Persons 2, 3, 4, and 5 can build against standardized data formats.

---

### 👤 PERSON 2: Growth & Trend Discovery Agent Developer
> **Mission**: Build the Growth Agent that autonomously polls trend signals, scores growth opportunities, and writes actionable insights into shared Minds memory.

#### 🎯 Key Responsibilities:
- **Trend Ingestion**: Build API connectors/scrapers for public data sources (e.g., X public API, Reddit RSS, Google Trends).
- **Opportunity Scoring Engine**: Implement logic inside the Minds Agent prompt/skills to rank trends based on creator niche relevance, viral potential, and effort score (1–100 scale).
- **Minds Skill & Memory Integration**: 
  - Expose the Growth Agent as a callable tool for the Coordinator (`search_trends`, `score_opportunity`).
  - Write outputs into `growth.opportunities` memory namespace.
- **Autonomous Monitoring**: Enable periodic polling so the agent generates fresh opportunity alerts automatically.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Niche keywords & platform preferences from `creator.profile` (Person 1).
- **Outputs**: Formatted JSON array of scored trend opportunities written to `growth.opportunities`.
- **Dependencies**: Depends on Person 1's memory schema; feeds Person 3's Content Agent.

---

### 👤 PERSON 3: Content Repurposing & Generation Agent Developer
> **Mission**: Build the Content Agent that converts raw video/audio transcripts or trending topics into platform-optimized content drafts tailored to the creator's voice.

#### 🎯 Key Responsibilities:
- **Repurposing Pipeline**: Build input handlers for video/audio transcripts, blog posts, or trending topics.
- **Multi-Platform Native Generators**: Train/prompt the Minds Content Agent to format native outputs:
  - **X (Twitter)**: Thread structure + hook + CTA.
  - **LinkedIn**: Thought leadership formatting + whitespace styling.
  - **YouTube Shorts / IG Reels**: 30-second video script with visual/audio cues.
- **Performance-Aware Draft Generation**: Read `analytics.performance_history` (from Person 4) to dynamically adjust tone, hook length, and hashtags based on historical high-performing posts.
- **Minds Skill & Memory Integration**:
  - Expose `generate_drafts` as a Minds tool.
  - Write draft outputs to `content.drafts` memory namespace.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Scored trends from Person 2 or raw transcripts + `analytics.performance_history` from Person 4.
- **Outputs**: Ready-to-approve content drafts saved in `content.drafts`.
- **Dependencies**: Depends on Person 2 (growth outputs) and Person 4 (analytics feedback loop).

---

### 👤 PERSON 4: Analytics & Social Integration Developer (Persistence Loop)
> **Mission**: Build the social publishing integration and metrics polling engine that updates Minds memory, closing the crucial Persistence Loop.

#### 🎯 Key Responsibilities:
- **Publishing Integration**: Integrate social publishing APIs (e.g., Zernio free tier / platform webhooks) to publish approved drafts.
- **Analytics Ingestion Engine**: Poll real or simulated engagement metrics (views, likes, shares, retention) post-publishing.
- **Persistence Loop Memory Writer**: Normalize raw metrics and write them directly into `analytics.performance_history` memory namespace.
- **Insight Extraction**: Generate actionable insights (e.g., *"Contrarian hooks performed +35% higher"*) for Person 3's Content Agent to read in future iterations.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Approved drafts from Person 3 / Dashboard (Person 5).
- **Outputs**: Normalized engagement data and insights stored in `analytics.performance_history`.
- **Dependencies**: Consumes drafts from Person 3; provides historical performance memory to Person 3 & Person 1.

---

### 👤 PERSON 5: Frontend Dashboard UI & Demo Video Lead
> **Mission**: Build the sleek creator-facing React/Vite web application and lead the script, recording, and editing of the winning 1.5–2 minute video demo.

#### 🎯 Key Responsibilities:
- **Creator Dashboard UI**: Build a responsive dark-mode React interface featuring:
  - **Delegation Trace Visualizer**: Live view of Coordinator -> Sub-agent thought process and tool execution.
  - **Opportunity Feed**: Interactive display of scored trends from Person 2.
  - **Draft Approval Station**: Multi-platform preview cards for Person 3's drafts.
  - **Persistence Memory Inspector**: Real-time visualizer of Minds memory namespaces and analytics growth charts.
- **Demo Video & Pitch (CRITICAL FOR WINNING)**:
  - Script, record, and edit the **1.5 – 2 minute demo video** required by judges.
  - Clearly articulate the Creator Economy problem, show live Minds agent autonomy & persistence loop, and demo the product end-to-end.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Data APIs / memory stores from Persons 1, 2, 3, and 4.
- **Outputs**: Live UI dashboard codebase, polished UX, and final 2-minute demo video submission.
- **Dependencies**: Connects all agent components visually and leads submission presentation.

---

## 🔄 Shared Data Schema & Memory Contracts

```json
// Minds Memory Namespace: creator.profile (Owned by Person 1)
{
  "creator_name": "TechExplorer",
  "niche": "AI & Developer Tools",
  "platforms": ["twitter", "linkedin", "youtube_shorts"],
  "brand_voice": "Informative, concise, engaging, developer-focused"
}

// Minds Memory Namespace: growth.opportunities (Owned by Person 2)
[
  {
    "id": "opp_001",
    "topic": "Open-source AI Agents",
    "source": "Reddit / r/LocalLLaMA",
    "opportunity_score": 92,
    "angle": "Why autonomous agent memory changes dev tools in 2026"
  }
]

// Minds Memory Namespace: content.drafts (Owned by Person 3)
[
  {
    "id": "draft_101",
    "opportunity_id": "opp_001",
    "platform": "twitter",
    "content": "AI agents without memory are just glorified search bars.\n\nHere is how persistent memory changes everything 🧵👇",
    "status": "pending_approval"
  }
]

// Minds Memory Namespace: analytics.performance_history (Owned by Person 4 & 5)
[
  {
    "post_id": "post_789",
    "platform": "twitter",
    "hook_style": "Contrarian statement",
    "engagement_rate": 8.4,
    "insight": "Contrarian hooks performed 35% better than question hooks."
  }
]
```

---

## 📅 Phased Execution Timeline (7-Day Sprint Plan)

| Phase | Person 1 (YOU - Lead) | Person 2 (Growth) | Person 3 (Content) | Person 4 (Analytics) | Person 5 (UI & Video) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Day 1** | Minds Mind & Base Schemas | Trend API & scraper setup | Prompt templates for X/LinkedIn | Social API / Zernio research | React UI setup & API mocks |
| **Day 2-3** | Coordinator Routing Logic | Growth Agent tool & memory write | Content Agent repurposing pipeline | Publishing & metrics polling engine | Dashboard wireframes & layout |
| **Day 4** | Connect Coordinator to sub-agents | Autonomous trend listener | Connect to performance memory | Memory persistence writer | Delegation trace UI component |
| **Day 5** | End-to-end flow validation | Edge case handling | Output formatting polish | Analytics feedback verification | UI polish & visual charts |
| **Day 6** | README & Tech Architecture docs | Submission docs support | Output audit | Persistence verification | **Record & edit demo video** |
| **Day 7** | Submission on Devpost/Jam platform | Buffer testing | Buffer testing | Buffer testing | Final video check & upload |

---

## 🏆 Submission Checklist
- [ ] Working product with Minds Agent at core
- [ ] Persistence demonstrated (memory read/write loop working across sessions)
- [ ] Clear creator-economy problem fit
- [ ] 1.5–2 minute demo video uploaded
- [ ] Code repo public with full technical documentation README
