// Sample interview transcripts for first-time users to explore the tool
// These are fictional but realistic B2B SaaS customer interviews

export interface SampleTranscript {
  name: string
  content: string
}

export const SAMPLE_TRANSCRIPTS: SampleTranscript[] = [
  {
    name: 'Sarah Chen - Engineering Manager',
    content: `**Interview: Sarah Chen, Engineering Manager at DataFlow Inc.**
**Date: January 15, 2025**
**Product: Developer collaboration tool**

---

**Interviewer:** Thanks for taking the time, Sarah. Can you start by telling me a bit about your role and team?

**Sarah:** Sure! I'm an engineering manager at DataFlow. We're a mid-size data infrastructure company, about 200 engineers total. I manage a platform team of 8 people. We build internal tools and maintain our CI/CD pipeline.

**Interviewer:** What's your team's current focus?

**Sarah:** Right now we're trying to reduce our deploy times. We went from deploying twice a week to wanting continuous deployment, but our tooling isn't keeping up. Engineers spend way too much time waiting for builds and debugging failed deployments.

**Interviewer:** How much time would you estimate?

**Sarah:** Honestly? Probably 4-5 hours per engineer per week just on deployment-related friction. Context switching while waiting for builds, tracking down why something failed, coordinating with other teams about breaking changes. It adds up fast.

**Interviewer:** What tools are you using today?

**Sarah:** Jenkins for CI, a homegrown deployment system, Slack for coordination. We've looked at other CI tools but the migration cost feels enormous. We have 6 years of Jenkins scripts.

**Interviewer:** What's the biggest pain point right now?

**Sarah:** Visibility. When a deploy fails, we have to dig through logs across three different systems to figure out what happened. There's no single place to see "here's what changed, here's what broke, here's who to talk to." My team ends up being the human glue.

**Interviewer:** If you could wave a magic wand and fix one thing, what would it be?

**Sarah:** I want my engineers to self-serve. Right now they come to my team for everything because the systems are too complex. If they could see exactly what's happening with their deploy, who's affected, and roll back safely without hand-holding, we could focus on actually improving the platform instead of being support.

**Interviewer:** Have you tried any solutions for this?

**Sarah:** We built a dashboard, but it's always out of date. Maintaining it is another job. We trialed one vendor but they wanted us to rip out Jenkins entirely—not gonna happen. We need something that works with what we have.

**Interviewer:** What would make you confident in adopting a new tool?

**Sarah:** Incremental adoption. Let me prove value with one team before asking for a company-wide rollout. Also, good docs. I don't have time to babysit another tool.`
  },
  {
    name: 'Marcus Johnson - DevOps Lead',
    content: `**Interview: Marcus Johnson, DevOps Lead at FinServ Technologies**
**Date: January 18, 2025**
**Product: Developer collaboration tool**

---

**Interviewer:** Thanks for joining, Marcus. Tell me about your setup.

**Marcus:** I run DevOps for a financial services company. About 50 engineers, very regulated environment. Everything we do has compliance implications—SOC 2, PCI, the works.

**Interviewer:** What's top of mind for you right now?

**Marcus:** Audit trails. Every time we have a compliance review, I spend two weeks pulling together evidence of who deployed what, when, and why. It's all there, technically, but scattered across Git commits, Jira tickets, Slack threads. Assembling it is brutal.

**Interviewer:** How often do these reviews happen?

**Marcus:** Quarterly for internal, annual for external audits. But really, any incident could trigger an ad-hoc review. Last month a config change caused a brief outage and I spent three days reconstructing the timeline for the postmortem.

**Interviewer:** What tools do you use for deployment?

**Marcus:** ArgoCD for Kubernetes deployments, GitHub Actions for CI. We have decent automation, but the human process around it is chaotic. Engineers make changes, but tracking the why—connecting code to tickets to approvals—requires detective work.

**Interviewer:** What have you tried to solve this?

**Marcus:** We wrote a lot of custom scripts to export data from different systems into a spreadsheet. It works but it's fragile. Every time something changes—new tool, new team, new compliance requirement—I'm rewriting scripts.

**Interviewer:** What would the ideal solution look like?

**Marcus:** Automatic lineage. I deploy something and the system knows: here's the PR, here's the ticket, here's who approved it, here's what environments it touched, here's the blast radius if something goes wrong. Don't make me hunt for it.

**Interviewer:** Is this a problem your whole team shares?

**Marcus:** Definitely. My junior folks spend even more time on it because they don't know where everything lives. I've thought about building something internal, but that's a 6-month project and I can't justify it when I have infrastructure to run.

**Interviewer:** What would make you pay for a solution?

**Marcus:** If it cut audit prep from two weeks to two days, that's a no-brainer. Show me the compliance report I can hand to auditors and I'll find the budget.`
  },
  {
    name: 'Priya Patel - Senior Developer',
    content: `**Interview: Priya Patel, Senior Developer at CloudScale**
**Date: January 22, 2025**
**Product: Developer collaboration tool**

---

**Interviewer:** Hi Priya, thanks for chatting. What's your role?

**Priya:** I'm a senior backend developer at CloudScale. We do cloud cost optimization—help companies reduce their AWS and GCP bills. I work on the recommendations engine.

**Interviewer:** What's your day-to-day like?

**Priya:** Writing code, reviewing PRs, debugging production issues. Pretty typical. We ship fast—multiple deploys per day. Most of the time it works, but when something breaks, it can get chaotic.

**Interviewer:** Tell me about the chaotic part.

**Priya:** Like last week, we had a regression in production. Something broke that worked fine in staging. We spent four hours figuring out that another team's change interacted badly with ours. Neither change was wrong individually, but together they caused issues.

**Interviewer:** How did you eventually figure it out?

**Priya:** Lots of Slack messages. Someone remembered seeing something in another channel. We compared deploy times, checked Git history, made guesses. It felt like archaeology.

**Interviewer:** How often does this happen?

**Priya:** Big incidents like that, maybe once a month. Smaller "why is this broken" investigations, almost daily. Someone's always asking "did anything change?" and the answer is always yes—but figuring out what changed that matters is the hard part.

**Interviewer:** What tools do you use?

**Priya:** GitHub for code, CircleCI for builds, Datadog for monitoring, PagerDuty for incidents. We have observability for the app, but not for the deploy process itself. I can tell you CPU spiked, but not necessarily which deploy caused it.

**Interviewer:** What would help most?

**Priya:** Connecting the dots automatically. If CPU spiked at 2:47 PM, show me what deployed between 2:30 and 2:47. Show me what changed. Show me who owns it. I don't want to be a detective—I want to be a developer.

**Interviewer:** Have you asked for tooling like this?

**Priya:** We've talked about it in retros, but it never gets prioritized over features. "Improve deploy visibility" is always on the backlog but never urgent until something breaks. Then everyone agrees we should fix it... until the fire's out.

**Interviewer:** If a tool like this existed, how would you want to discover changes?

**Priya:** Timeline view. Show me a feed of what's happening, filterable by team or service. Like a news feed for deployments. Real-time, so I can see "oh, Team X just deployed, let me wait before I push mine."`
  },
  {
    name: 'David Kim - CTO',
    content: `**Interview: David Kim, CTO at Veritas Analytics**
**Date: January 25, 2025**
**Product: Developer collaboration tool**

---

**Interviewer:** Thanks for making time, David. As CTO, what's your biggest priority right now?

**David:** Developer productivity. We're a 30-person startup trying to compete with companies 10x our size. Every hour of wasted engineering time hurts. I need people building features, not fighting infrastructure.

**Interviewer:** Where do you see the most time wasted?

**David:** Coordination overhead. We're past the stage where everyone knows everything. Now we have three teams, separate roadmaps, shared services. Someone makes a change, and two days later another team discovers it broke their thing. The communication tax is killing us.

**Interviewer:** Can you give me a specific example?

**David:** Sure. We have a shared authentication service. One team needed a new field, added it, deployed. Didn't realize another team had a hard dependency on the old schema. Broke their feature on Friday afternoon. Took until Monday to fully resolve because people didn't know who to contact.

**Interviewer:** How do teams coordinate changes today?

**David:** Slack, mostly. There's an #engineering-deploys channel but it's noisy and people miss things. We have a wiki page listing service owners but it's outdated. I tried requiring PR reviews across teams but it became a bottleneck.

**Interviewer:** What have you tried?

**David:** We experimented with RFC docs for big changes, but the overhead was too high for smaller changes, and the small changes still cause incidents. We looked at feature flags but that's more about rollout than coordination.

**Interviewer:** What would the ideal solution look like?

**David:** Dependency awareness. When I'm about to deploy, tell me who might care. Show me downstream services, recent changes to things I depend on, teams that touched related code. Not blocking, just informing. Let people make informed decisions.

**Interviewer:** How do you measure engineering productivity today?

**David:** Deploy frequency, lead time, incident rate. Classic DORA stuff. We're okay on frequency—we deploy a lot. But our lead time from "code written" to "confidently in production" is longer than it should be because of the coordination overhead.

**Interviewer:** What would move the needle for you?

**David:** Reduce incidents caused by coordination failures by 50%. Every incident costs us a day of debugging plus morale impact. If I could get that day back, that's real money.

**Interviewer:** If you were evaluating a tool for this, what matters?

**David:** Fast time-to-value. I don't have 3 months for onboarding. Show me results in a week or I'll lose buy-in from the team. And don't add process—reduce it. Another mandatory step before deploy is the last thing we need.`
  },
  {
    name: 'Amanda Torres - Platform Engineer',
    content: `**Interview: Amanda Torres, Platform Engineer at MediaStream**
**Date: January 28, 2025**
**Product: Developer collaboration tool**

---

**Interviewer:** Hey Amanda, tell me about your role at MediaStream.

**Amanda:** I'm on the platform team. We're a streaming video company, about 100 engineers. My job is making sure developers can ship code without thinking about infrastructure. We handle Kubernetes, service mesh, observability—all that stuff.

**Interviewer:** What challenges are you facing?

**Amanda:** Honestly, we're victims of our own success. We've made it too easy to deploy. Teams ship constantly—sometimes 50 deploys a day across the company. That's great for velocity, but it means when something breaks, the "what changed?" question has 50 possible answers.

**Interviewer:** How do you handle that today?

**Amanda:** Lots of manual work. We correlate timestamps between deploys and metrics, we check Git logs, we ask around. For big incidents we have a formal process, but for the daily "hmm this is weird" stuff, it's ad hoc.

**Interviewer:** What's your tooling stack?

**Amanda:** ArgoCD for GitOps, Prometheus and Grafana for metrics, Jaeger for tracing, Loki for logs. We're not lacking data—we're drowning in it. What we lack is connection. The systems don't talk to each other in a way that helps you understand cause and effect.

**Interviewer:** Can you tell me about a recent incident?

**Amanda:** Two weeks ago, latency spiked on our video encoding service. Metrics showed it clearly, but Grafana doesn't know about deploys. We had to manually overlay deploy times. Turned out a new team member had deployed with verbose logging enabled—nothing malicious, just a mistake. Took an hour to find what should've taken five minutes.

**Interviewer:** What did you learn from that?

**Amanda:** We need deploy context in our observability. I shouldn't have to switch between five tools to see "here's the metric spike, and here's the deploy that happened right before it." That linkage should be automatic.

**Interviewer:** Have you built anything custom for this?

**Amanda:** Started to. We have a script that annotates Grafana dashboards with deploy markers. It works okay but it's another thing to maintain. And it doesn't help for Jaeger or Loki. Building integrations for every tool isn't sustainable.

**Interviewer:** What would you want from a third-party solution?

**Amanda:** Universal deploy timeline that integrates with everything. When I look at traces, show me what version of each service was running. When I look at logs, show me the deploy context. Don't make me be the integration layer.

**Interviewer:** Anything else top of mind?

**Amanda:** Change velocity visibility for leadership. My VP keeps asking "are we shipping faster than last quarter?" and I have no good answer. We measure deploys but not whether they're meaningful. I'd love to say "we shipped 20% more changes to production" with actual data.`
  }
]

// First sample for quick demo - shorter and focused
export const DEMO_TRANSCRIPT: SampleTranscript = {
  name: 'Quick Demo Transcript',
  content: `**Customer Interview - Jamie Lee, Tech Lead**

**Interviewer:** What's your biggest challenge with deployments?

**Jamie:** Visibility. When something breaks, I spend more time figuring out what changed than actually fixing it. Last week a deploy took down our API—took us two hours just to identify which of the twelve changes that day caused it.

**Interviewer:** How do you track changes today?

**Jamie:** Git log, Slack, asking around. It's manual and slow. We have monitoring for the app but not for the deploy process. I can see CPU spiked but not which deploy did it.

**Interviewer:** What would help?

**Jamie:** A timeline. Show me everything that deployed, when, and who owns it. Connect it to my metrics. Don't make me play detective.`
}
