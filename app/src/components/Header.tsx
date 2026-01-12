import { Zap, Clock, Settings, Download } from 'lucide-react'

interface HeaderProps {
  onHistoryClick: () => void
  onSettingsClick: () => void
  historyOpen: boolean
}

export function Header({ onHistoryClick, onSettingsClick, historyOpen }: HeaderProps) {
  const handleGuideDownload = () => {
    // Download the interview guide as markdown
    const guideContent = INTERVIEW_GUIDE_CONTENT
    const blob = new Blob([guideContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'interview-guide.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <header className="relative border-b border-surface-800/60 bg-surface-950/80 backdrop-blur-xl px-6 py-4">
      {/* Subtle gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent-500/20 rounded-xl blur-xl group-hover:bg-accent-500/30 transition-all duration-500" />
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-surface-950 shadow-lg">
              <Zap className="h-5 w-5" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="font-display text-lg font-semibold text-surface-100 tracking-tight">
              Interview Analysis
            </h1>
            <p className="text-sm text-surface-500">
              Customer interviews → roadmap insights
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onHistoryClick}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${historyOpen
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/30'
                : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
              }
            `}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </button>

          <button
            onClick={handleGuideDownload}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-all"
            title="Download Interview Guide"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          <button
            onClick={onSettingsClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-all"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}

// Interview guide content as markdown
const INTERVIEW_GUIDE_CONTENT = `# Interview Guide

20-minute customer discovery script optimized for meta-analysis.

## Phase 1: Open (2 min)

### Setup (30 sec)
> "Thanks so much for taking the time. I've got a transcription tool running—it just lets me talk to you and not have to take notes. If you're okay with that, we'll jump right in."

### Purpose Frame (90 sec)
> "What I'd love to do today—and we'll keep it right at 20 minutes—is learn from you. This is strictly for us to understand your experience, the challenges you've faced, and what you need. We're using this feedback to prioritize what we build next. There are no right or wrong answers."

**Key points:**
- Time-bounded commitment (20 minutes)
- Learning orientation (not a pitch)
- Their expertise is valuable
- Confidential/internal use

## Phase 2: Context (5 min)

### Background (2 min)
> "Could you give me a bit of your background? What brought you to [Company], and what motivated you to work on this problem?"

**Listen for:** Origin story, Domain expertise, Underlying motivation

### Current Focus (3 min)
> "And what are you focused on right now? What does the product do, and who are your primary customers?"

**Listen for:** Core value proposition, Customer segment, Stage of company

## Phase 3: Stack (5 min)

### Technology Choices (3 min)
> "Could you talk me through your stack? What third-party tools, libraries, or services have you brought in versus built yourself?"

**Listen for:** Buy vs. build decisions, Vendor choices, Integration points

### Evaluation Process (2 min)
> "When you evaluate a new component or technology, is there a formal process you go through? Or is that more ad hoc?"

**Listen for:** Decision criteria, Deal-breakers, Trust factors

## Phase 4: Problems (6 min) ⭐ CORE

**This is the core of the interview. Spend the most energy here.**

### Open-ended Challenge (2 min)
> "What would you say are the biggest challenges or frustrations you've faced in building and scaling the product—particularly around [relevant domain]?"

**Listen for:** Pain intensity, Frequency, Workarounds attempted

### Dig Deeper (2 min)
> "Can you tell me about the last time that happened? What made it hard?"

*Context reinstatement: Get them into a specific memory, not generalizations.*

### Gap Identification (2 min)
> "Are there walls you're still bouncing off of? Things where you've looked around and said, 'we just haven't found what we're looking for'?"

**Listen for:** Unmet needs, Product opportunities, Market gaps

## Phase 5: Magic Wand (2 min)

> "Last question—this is the magic wand question. If you could summon any technology, product, or service that would solve one of your biggest challenges, what would it look like? Feel free to think unshackled—that's the point."

**Listen for:** Aspirational solutions, Priority signals, Latent desires

## Phase 6: Close (2 min)

### Follow-up Permission
> "Would it be okay if I come back to you? If we have a beta of anything you've described, I'd love to show it to you and get your feedback."

### Referral Ask
> "Is there anyone else you'd recommend I speak with who faces similar challenges? I'm happy to keep the intro warm if you'd be willing to make it."

*80-90% success rate vs. 10% cold outreach*

### Thank You
> "This has been tremendously helpful. Thank you so much for your time. You'll hear from us soon."

---

## Probing Techniques

| Technique | Example |
|-----------|---------|
| Clarify/Restate | "So if I'm hearing you right, you're saying..." |
| Devil's Advocate | "If we invert that—what would have to change?" |
| Specific Examples | "Have you looked at [X] or [Y]?" |
| Process Questions | "Walk me through how that works day-to-day." |
| Contextualize | "Tell me about the last time that happened." |
| Get Wrong on Purpose | Summarize incorrectly—they'll correct with richer detail |

## What Makes a Transcript Useful

- **Consistent question arc:** Same phases across all interviews
- **Interviewee's own words:** Don't paraphrase during transcription
- **Problem-focused:** At least 30% of time on challenges/gaps
- **Magic wand captured:** Explicit aspirational solutions recorded
- **Attribution-ready:** Interviewee name/role/company in the file
`
