# CreatorOS — Creative Minds Jam #1
## Team Role Allocation & Technical Execution Plan (4-Person Team)

---

### Executive Overview & Winning Strategy
**CreatorOS** is an autonomous multi-agent system built natively on **Minds by Animoca Brands** (`hellominds.ai`). It serves as an AI Chief of Staff for digital creators, combining trend monitoring, multi-platform content generation/repurposing, and automated performance feedback loops.

#### Winning the Hackathon Criteria:
1. **Minds Integration Depth (Score 10/10)**: Uses native Minds Skills, tool-calling delegation, and multi-agent memory namespaces (`creator.profile`, `growth.opportunities`, `content.drafts`, `analytics.performance_history`).
2. **Persistence Demonstration (Score 10/10)**: Demonstrates true memory continuity across sessions—the Analytics Agent writes engagement data back into Minds memory, which directly changes how the Content Agent crafts future posts.
3. **Creator-Economy Problem Fit (Score 10/10)**: Solves creator burnout, audience retention, and cross-platform growth.
4. **Execution & Completeness**: Functional working product, interactive dashboard, and tight 1.5–2 min video demo.

---

## 👥 4-Person Role Breakdown

---

### 👤 PERSON 1: Lead Architect & Minds Coordinator Agent (Team Lead)
> **Mission**: Build the core Minds Coordinator Agent, orchestrate multi-agent delegation, maintain memory architecture, and manage the GitHub repository & documentation.

#### 🎯 Key Responsibilities:
- **Minds Setup & Cognition Boost**: Setup the main Mind on `hellominds.ai` and apply the hackathon cognition boost.
- **Coordinator Routing Logic**: Build the central orchestrator agent that receives creator instructions (e.g., *"Help me grow my Tech YouTube channel this week"*), interprets intent, and delegates tasks to sub-agents via tool calls.
- **Memory Schema & Namespace Management**: Define and maintain shared Minds memory keys:
  - `creator.profile` (Creator voice, target audience, preferred platforms, goals)
  - `system.delegation_trace` (Logs of agent-to-agent interactions)
- **Technical Documentation & Repo**: Maintain clean repo structure, API contracts, `README.md`, and architecture diagrams required for submission.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Creator prompt / intent from Dashboard (Person 4).
- **Outputs**: Delegated commands to Growth (Person 2) & Content (Person 3) agents; combined executive summary back to Dashboard.
- **Dependencies**: Ships baseline schema on Day 1 so Persons 2, 3, and 4 can build against standardized data formats.

---

### 👤 PERSON 2: Growth & Trend Discovery Agent Developer
> **Mission**: Build the Growth Agent that autonomously polls trend signals, scores growth opportunities, and writes actionable insights into shared Minds memory.

#### 🎯 Key Responsibilities:
- **Trend Ingestion**: Build API connectors/scrapers for public data sources (e.g., X public API/Reddit/Google Trends RSS).
- **Opportunity Scoring Engine**: Implement logic inside the Minds Agent prompt/skills to rank trends based on creator niche relevance, viral potential, and effort score (1–100 scale).
- **Minds Skill & Memory Integration**: 
  - Expose the Growth Agent as a callable tool for the Coordinator (`search_trends`, `score_opportunity`).
  - Write outputs into `growth.opportunities` memory namespace.
- **Autonomous Monitoring / Persistence**: Enable autonomous periodic polling so the agent generates fresh opportunity alerts even when the user is offline.

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
- **Inputs**: Scored trends from Person 2 or raw transcripts from user + `analytics.performance_history` from Person 4.
- **Outputs**: Ready-to-approve content drafts saved in `content.drafts`.
- **Dependencies**: Depends on Person 2 (growth outputs) and Person 4 (analytics feedback loop).

---

### 👤 PERSON 4: Analytics, Persistence Loop & Frontend/Demo Lead
> **Mission**: Build the Analytics & Publishing feedback engine, front-end dashboard UI, and create the winning 1.5–2 minute submission video.

#### 🎯 Key Responsibilities:
- **Analytics & Publishing Pipeline**:
  - Integrate Zernio / social APIs for zero-friction posting & metrics retrieval.
  - Fetch engagement stats (views, likes, shares, retention) post-publishing.
  - Write normalized metrics into `analytics.performance_history` memory namespace (completing the core **Persistence Loop**).
- **Creator Dashboard UI**: Build a sleek React/Vite web interface displaying:
  - Agent delegation trace (showing Coordinator -> Growth -> Content reasoning).
  - Trend opportunity queue.
  - Content draft approval interface.
  - Memory & analytics continuity visualizer.
- **Demo Video & Pitch (CRITICAL FOR WINNING)**:
  - Script, record, and edit the **1.5 – 2 minute demo video**.
  - Clearly articulate the Creator Economy problem, show live Minds agent autonomy & persistence loop, and demo the product end-to-end.

#### 📦 Deliverables & Dependencies:
- **Inputs**: Drafts from Person 3, execution traces from Person 1.
- **Outputs**: Live UI dashboard, populated performance memory, published posts, and final video demo.
- **Dependencies**: Consumes outputs from Persons 1, 2, and 3; provides the visual wrap and feedback loop.

---

## 🔄 Shared Data Schema & Memory Contracts

To prevent blockages, all 4 developers agree on the following JSON schemas on Day 1:

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

// Minds Memory Namespace: analytics.performance_history (Owned by Person 4)
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

| Phase | Focus | Person 1 (Lead) | Person 2 (Growth) | Person 3 (Content) | Person 4 (Analytics/UI/Video) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Day 1** | **Architecture & Schemas** | Minds Mind creation + Base schema setup | Public API research & trend parsing script | Prompt templates & multi-platform logic | React UI setup & API mockup |
| **Day 2-3** | **Core Agent Build** | Coordinator tool-calling loop & delegation | Growth Agent skill & `growth.opportunities` memory | Content Agent skill & repurposing pipeline | Dashboard wireframe & Zernio API link |
| **Day 4** | **Integration & Persistence** | Connect Coordinator to Growth & Content agents | Test autonomous trend polling trigger | Implement reading from performance memory | Build feedback loop + display memory state |
| **Day 5** | **End-to-End Testing** | Full flow validation (Intent -> Trend -> Post -> Metrics) | Edge case handling & scoring tune | Output polishing (hooks & native formatting) | UI polish, animations, mobile layout |
| **Day 6** | **Documentation & Video** | Write README.md & tech architecture docs | Help refine submission text & codebase comments | Final prompt audit & output verification | **Record & edit 1.5–2 min video demo** |
| **Day 7** | **Submission & Buffer** | Final repo review, submit on Devpost/Jam platform | Buffer testing | Buffer testing | Final video check & upload |

---

## 🏆 Submission Checklist
- [ ] Working product with Minds Agent at core
- [ ] Persistence demonstrated (memory read/write loop working across sessions)
- [ ] Clear creator-economy problem fit
- [ ] 1.5–2 minute demo video uploaded
- [ ] Code repo public with full technical documentation README
