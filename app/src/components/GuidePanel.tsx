export function GuidePanel() {
  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-semibold text-surface-100 mb-1">
          Interview Guide
        </h2>
        <p className="text-sm text-surface-500">
          20-minute customer discovery script optimized for meta-analysis
        </p>
      </div>

      <div className="space-y-6">
        {/* Phase 1 */}
        <Section title="Phase 1: Open" time="2 min" color="blue">
          <ScriptBlock label="Setup (30 sec)">
            "Thanks so much for taking the time. I've got a transcription tool running—it just lets
            me talk to you and not have to take notes. If you're okay with that, we'll jump right in."
          </ScriptBlock>
          <ScriptBlock label="Purpose Frame (90 sec)">
            "What I'd love to do today—and we'll keep it right at 20 minutes—is learn from you.
            This is strictly for us to understand your experience, the challenges you've faced,
            and what you need. We're using this feedback to prioritize what we build next.
            There are no right or wrong answers."
          </ScriptBlock>
          <KeyPoints points={[
            "Time-bounded commitment (20 minutes)",
            "Learning orientation (not a pitch)",
            "Their expertise is valuable",
            "Confidential/internal use"
          ]} />
        </Section>

        {/* Phase 2 */}
        <Section title="Phase 2: Context" time="5 min" color="green">
          <ScriptBlock label="Background (2 min)">
            "Could you give me a bit of your background? What brought you to [Company],
            and what motivated you to work on this problem?"
          </ScriptBlock>
          <ListenFor items={["Origin story", "Domain expertise", "Underlying motivation"]} />

          <ScriptBlock label="Current Focus (3 min)">
            "And what are you focused on right now? What does the product do,
            and who are your primary customers?"
          </ScriptBlock>
          <ListenFor items={["Core value proposition", "Customer segment", "Stage of company"]} />
        </Section>

        {/* Phase 3 */}
        <Section title="Phase 3: Stack" time="5 min" color="purple">
          <ScriptBlock label="Technology Choices (3 min)">
            "Could you talk me through your stack? What third-party tools, libraries,
            or services have you brought in versus built yourself?"
          </ScriptBlock>
          <ListenFor items={["Buy vs. build decisions", "Vendor choices", "Integration points"]} />

          <ScriptBlock label="Evaluation Process (2 min)">
            "When you evaluate a new component or technology, is there a formal process
            you go through? Or is that more ad hoc?"
          </ScriptBlock>
          <ListenFor items={["Decision criteria", "Deal-breakers", "Trust factors"]} />
        </Section>

        {/* Phase 4 */}
        <Section title="Phase 4: Problems" time="6 min" color="amber" highlight>
          <div className="text-sm text-amber-400 font-medium mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            This is the core of the interview. Spend the most energy here.
          </div>

          <ScriptBlock label="Open-ended Challenge (2 min)">
            "What would you say are the biggest challenges or frustrations you've faced
            in building and scaling the product—particularly around [relevant domain]?"
          </ScriptBlock>
          <ListenFor items={["Pain intensity", "Frequency", "Workarounds attempted"]} />

          <ScriptBlock label="Dig Deeper (2 min)">
            "Can you tell me about the last time that happened? What made it hard?"
          </ScriptBlock>
          <p className="text-xs text-surface-500 mb-4 italic">
            Context reinstatement: Get them into a specific memory, not generalizations.
          </p>

          <ScriptBlock label="Gap Identification (2 min)">
            "Are there walls you're still bouncing off of? Things where you've looked around
            and said, 'we just haven't found what we're looking for'?"
          </ScriptBlock>
          <ListenFor items={["Unmet needs", "Product opportunities", "Market gaps"]} />
        </Section>

        {/* Phase 5 */}
        <Section title="Phase 5: Magic Wand" time="2 min" color="pink">
          <ScriptBlock>
            "Last question—this is the magic wand question. If you could summon any technology,
            product, or service that would solve one of your biggest challenges, what would it
            look like? Feel free to think unshackled—that's the point."
          </ScriptBlock>
          <ListenFor items={["Aspirational solutions", "Priority signals", "Latent desires"]} />
        </Section>

        {/* Phase 6 */}
        <Section title="Phase 6: Close" time="2 min" color="teal">
          <ScriptBlock label="Follow-up Permission">
            "Would it be okay if I come back to you? If we have a beta of anything you've
            described, I'd love to show it to you and get your feedback."
          </ScriptBlock>

          <ScriptBlock label="Referral Ask">
            "Is there anyone else you'd recommend I speak with who faces similar challenges?
            I'm happy to keep the intro warm if you'd be willing to make it."
          </ScriptBlock>
          <p className="text-xs text-surface-500 mb-4">
            80-90% success rate vs. 10% cold outreach
          </p>

          <ScriptBlock label="Thank You">
            "This has been tremendously helpful. Thank you so much for your time.
            You'll hear from us soon."
          </ScriptBlock>
        </Section>

        {/* Probing Techniques */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-surface-100 mb-4">
            Probing Techniques
          </h3>
          <div className="space-y-0">
            <ProbeRow technique="Clarify/Restate" example={`"So if I'm hearing you right, you're saying..."`} />
            <ProbeRow technique="Devil's Advocate" example={`"If we invert that—what would have to change?"`} />
            <ProbeRow technique="Specific Examples" example='"Have you looked at [X] or [Y]?"' />
            <ProbeRow technique="Process Questions" example='"Walk me through how that works day-to-day."' />
            <ProbeRow technique="Contextualize" example='"Tell me about the last time that happened."' />
            <ProbeRow technique="Get Wrong on Purpose" example="Summarize incorrectly—they'll correct with richer detail" isLast />
          </div>
        </div>

        {/* Tips */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-surface-100 mb-4">
            What Makes a Transcript Useful
          </h3>
          <div className="space-y-3">
            {[
              ["Consistent question arc", "Same phases across all interviews"],
              ["Interviewee's own words", "Don't paraphrase during transcription"],
              ["Problem-focused", "At least 30% of time on challenges/gaps"],
              ["Magic wand captured", "Explicit aspirational solutions recorded"],
              ["Attribution-ready", "Interviewee name/role/company in the file"],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-4 text-sm">
                <span className="font-medium text-surface-300 w-44 flex-shrink-0">
                  {title}
                </span>
                <span className="text-surface-500">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({
  title,
  time,
  color,
  highlight,
  children
}: {
  title: string
  time: string
  color: 'blue' | 'green' | 'purple' | 'amber' | 'pink' | 'teal'
  highlight?: boolean
  children: React.ReactNode
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    pink: 'bg-pink-500',
    teal: 'bg-teal-500',
  }

  const borderClasses = {
    blue: 'border-blue-500/20',
    green: 'border-green-500/20',
    purple: 'border-purple-500/20',
    amber: 'border-amber-500/30',
    pink: 'border-pink-500/20',
    teal: 'border-teal-500/20',
  }

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        highlight
          ? 'border-amber-500/30 bg-amber-500/5'
          : `border-surface-800 ${borderClasses[color]}`
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
        <h3 className="font-display font-semibold text-surface-100">{title}</h3>
        <span className="text-xs text-surface-500 bg-surface-800 px-2 py-0.5 rounded-full">
          {time}
        </span>
      </div>
      {children}
    </div>
  )
}

function ScriptBlock({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      {label && (
        <div className="text-xs font-medium text-surface-500 mb-1.5">{label}</div>
      )}
      <blockquote className="text-sm text-surface-300 bg-surface-800/50 rounded-lg p-4 border-l-2 border-surface-600 italic leading-relaxed">
        {children}
      </blockquote>
    </div>
  )
}

function ListenFor({ items }: { items: string[] }) {
  return (
    <div className="mb-4">
      <div className="text-xs font-medium text-surface-500 mb-2">Listen for:</div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="text-xs bg-surface-800 text-surface-400 px-2.5 py-1 rounded-lg border border-surface-700/50">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function KeyPoints({ points }: { points: string[] }) {
  return (
    <div>
      <div className="text-xs font-medium text-surface-500 mb-2">Key points:</div>
      <ul className="space-y-1.5">
        {points.map((point) => (
          <li key={point} className="text-sm text-surface-400 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-surface-600 flex-shrink-0" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProbeRow({ technique, example, isLast }: { technique: string; example: string; isLast?: boolean }) {
  return (
    <div className={`flex gap-4 text-sm py-3 ${!isLast ? 'border-b border-surface-800/50' : ''}`}>
      <div className="w-40 flex-shrink-0 font-medium text-surface-300">
        {technique}
      </div>
      <div className="text-surface-500">
        {example}
      </div>
    </div>
  )
}
