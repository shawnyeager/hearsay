export function GuidePanel() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h2>Customer Discovery Interview Script (20 Minutes)</h2>
      <p>
        A tight, structured interview script for gathering actionable product insights.
        Optimized for later meta-analysis across multiple transcripts.
      </p>

      <hr />

      <h3>Pre-Interview Checklist</h3>
      <ul>
        <li>Research interviewee (LinkedIn, company website, recent news)</li>
        <li>Set up recording/transcription tool</li>
        <li>Confirm 20-minute commitment</li>
        <li>Have backup questions ready if conversation moves fast</li>
        <li>Clear your next 30 minutes (buffer for overrun)</li>
      </ul>

      <hr />

      <h3>Phase 1: Open — 2 minutes</h3>
      
      <h4>Setup (30 sec)</h4>
      <blockquote>
        "Thanks so much for taking the time. I've got a transcription tool running—it just lets
        me talk to you and not have to take notes. If you're okay with that, we'll jump right in."
      </blockquote>

      <h4>Purpose Frame (90 sec)</h4>
      <blockquote>
        "What I'd love to do today—and we'll keep it right at 20 minutes—is learn from you.
        This is strictly for us to understand your experience, the challenges you've faced,
        and what you need. We're using this feedback to prioritize what we build next.
        There are no right or wrong answers."
      </blockquote>

      <p><strong>Key points to hit:</strong></p>
      <ul>
        <li>Time-bounded commitment (20 minutes)</li>
        <li>Learning orientation (not a pitch)</li>
        <li>Their expertise is valuable</li>
        <li>Confidential/internal use</li>
      </ul>

      <hr />

      <h3>Phase 2: Context — 5 minutes</h3>

      <h4>Background (2 min)</h4>
      <blockquote>
        "Could you give me a bit of your background? What brought you to [Company],
        and what motivated you to work on this problem?"
      </blockquote>
      <p><em>Listen for:</em> Origin story, domain expertise, underlying motivation</p>

      <h4>Current Focus (3 min)</h4>
      <blockquote>
        "And what are you focused on right now? What does the product do,
        and who are your primary customers?"
      </blockquote>
      <p><em>Listen for:</em> Core value proposition, customer segment, stage of company</p>

      <hr />

      <h3>Phase 3: Stack — 5 minutes</h3>

      <h4>Technology Choices (3 min)</h4>
      <blockquote>
        "Could you talk me through your stack? What third-party tools, libraries,
        or services have you brought in versus built yourself?"
      </blockquote>
      <p><em>Listen for:</em> Buy vs. build decisions, vendor choices, integration points</p>

      <h4>Evaluation Process (2 min)</h4>
      <blockquote>
        "When you evaluate a new component or technology, is there a formal process
        you go through? Or is that more ad hoc?"
      </blockquote>
      <p><em>Listen for:</em> Decision criteria, deal-breakers, trust factors</p>

      <p><strong>Probing options:</strong></p>
      <ul>
        <li>"Just to throw some names out—have you looked at [Vendor X] or others in that space?"</li>
        <li>"Is that a function of needing full control, or just that nothing adequate exists?"</li>
      </ul>

      <hr />

      <h3>Phase 4: Problems — 6 minutes</h3>
      <p className="text-amber-600 dark:text-amber-400 font-medium">
        This is the core of the interview. Spend the most energy here.
      </p>

      <h4>Open-ended Challenge Question (2 min)</h4>
      <blockquote>
        "What would you say are the biggest challenges or frustrations you've faced
        in building and scaling the product—particularly around [relevant domain]?"
      </blockquote>
      <p><em>Listen for:</em> Pain intensity, frequency, workarounds attempted</p>

      <h4>Dig Deeper (2 min)</h4>
      <blockquote>
        "Can you tell me about the last time that happened? What made it hard?"
      </blockquote>
      <p><em>Context reinstatement technique:</em> Get them into a specific memory, not generalizations.</p>

      <h4>Gap Identification (2 min)</h4>
      <blockquote>
        "Are there walls you're still bouncing off of? Things where you've looked around
        and said, 'we just haven't found what we're looking for'?"
      </blockquote>
      <p><em>Listen for:</em> Unmet needs, product opportunities, market gaps</p>

      <p><strong>Probing options:</strong></p>
      <ul>
        <li>"If we invert that—what would someone have to pry out of your hands? What's crucial that you keep full control over?"</li>
        <li>"Is that something you've tried to solve with third-party tools, or have you had to build it yourself?"</li>
        <li>"What don't you love about the solutions you've tried?"</li>
      </ul>

      <hr />

      <h3>Phase 5: Magic Wand — 2 minutes</h3>

      <blockquote>
        "Last question—this is the magic wand question. If you could summon any technology,
        product, or service that would solve one of your biggest challenges, what would it
        look like? Feel free to think unshackled—that's the point."
      </blockquote>
      <p><em>Listen for:</em> Aspirational solutions, priority signals, latent desires</p>

      <p><strong>Follow-up if needed:</strong></p>
      <ul>
        <li>"What would ideal look like for you?"</li>
        <li>"What would make you sleep better at night?"</li>
      </ul>

      <hr />

      <h3>Phase 6: Close — 2 minutes</h3>

      <h4>Follow-up Permission (30 sec)</h4>
      <blockquote>
        "Would it be okay if I come back to you? If we have a beta of anything you've
        described, I'd love to show it to you and get your feedback."
      </blockquote>

      <h4>Referral Ask (30 sec)</h4>
      <blockquote>
        "Is there anyone else you'd recommend I speak with who faces similar challenges?
        I'm happy to keep the intro warm if you'd be willing to make it."
      </blockquote>
      <p className="text-sm text-gray-500">(80-90% success rate vs. 10% cold outreach)</p>

      <h4>Thank You (30 sec)</h4>
      <blockquote>
        "This has been tremendously helpful. Thank you so much for your time.
        You'll hear from us soon."
      </blockquote>

      <hr />

      <h3>Probing Techniques Reference</h3>
      <table>
        <thead>
          <tr>
            <th>Technique</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Clarify/Restate</strong></td>
            <td>"So if I'm hearing you right, you're saying..."</td>
          </tr>
          <tr>
            <td><strong>Devil's Advocate</strong></td>
            <td>"If we invert that—what would have to change for you to consider an alternative?"</td>
          </tr>
          <tr>
            <td><strong>Specific Examples</strong></td>
            <td>"Just to throw some names out—have you looked at [X] or [Y]?"</td>
          </tr>
          <tr>
            <td><strong>Process Questions</strong></td>
            <td>"Could you walk me through how that works day-to-day?"</td>
          </tr>
          <tr>
            <td><strong>Contextualize</strong></td>
            <td>"Can you tell me about the last time that happened?"</td>
          </tr>
          <tr>
            <td><strong>Trade-off Test</strong></td>
            <td>"Is that about precision, or just that nothing adequate exists?"</td>
          </tr>
          <tr>
            <td><strong>Get Wrong on Purpose</strong></td>
            <td>Summarize incorrectly—they'll often correct you with richer detail</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h3>What Makes a Transcript Useful for Meta-Analysis</h3>
      <ul>
        <li><strong>Consistent question arc</strong> — Same phases across all interviews</li>
        <li><strong>Interviewee's own words</strong> — Don't paraphrase during transcription</li>
        <li><strong>Problem-focused</strong> — At least 30% of time on challenges/gaps</li>
        <li><strong>Magic wand captured</strong> — Explicit aspirational solutions recorded</li>
        <li><strong>Attribution-ready</strong> — Interviewee name/role/company in the file</li>
      </ul>
    </div>
  )
}
