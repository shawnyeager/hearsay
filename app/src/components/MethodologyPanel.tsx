import { useState } from 'react'
import { X, Copy, Check, ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import type { PromptPreset } from '@/prompts/presets'

interface MethodologyPanelProps {
  preset: PromptPreset | null
  open: boolean
  onClose: () => void
}

export function MethodologyPanel({ preset, open, onClose }: MethodologyPanelProps) {
  const [copied, setCopied] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['TASK', 'METHODOLOGY']))

  if (!preset) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(preset.systemPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = (title: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  // Parse prompt into sections
  const sections = parsePromptSections(preset.systemPrompt)

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[600px] max-w-[95vw] z-50
          bg-white border-l border-surface-200
          transform transition-transform duration-300 ease-out
          flex flex-col
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-100 border border-accent-200 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-accent-600" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-surface-900">
                {preset.name} Methodology
              </h2>
              <p className="text-xs text-surface-500">
                {preset.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-600 hover:text-surface-800 hover:bg-surface-100 transition-colors"
              title="Copy full prompt"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Title section */}
          {sections.title && (
            <div className="px-5 py-4 border-b border-surface-100">
              <h1 className="font-display text-lg font-semibold text-surface-900 mb-2">
                {sections.title}
              </h1>
              {sections.intro && (
                <p className="text-sm text-surface-600 leading-relaxed">
                  {sections.intro}
                </p>
              )}
            </div>
          )}

          {/* Collapsible sections */}
          <div className="divide-y divide-surface-100">
            {sections.sections.map((section) => (
              <CollapsibleSection
                key={section.title}
                title={section.title}
                content={section.content}
                expanded={expandedSections.has(section.title)}
                onToggle={() => toggleSection(section.title)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-surface-200 bg-surface-50">
          <p className="text-xs text-surface-500 text-center">
            This prompt is sent as the system message when you run analysis
          </p>
        </div>
      </div>
    </>
  )
}

interface CollapsibleSectionProps {
  title: string
  content: string
  expanded: boolean
  onToggle: () => void
}

function CollapsibleSection({ title, content, expanded, onToggle }: CollapsibleSectionProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-surface-50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-surface-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-surface-400 flex-shrink-0" />
        )}
        <span className="font-medium text-sm text-surface-800">{title}</span>
      </button>
      {expanded && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className="pl-6 text-sm text-surface-600 leading-relaxed prose-methodology">
            <FormattedContent content={content} />
          </div>
        </div>
      )}
    </div>
  )
}

function FormattedContent({ content }: { content: string }) {
  // Split content into lines and render with appropriate formatting
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: string[] = []
  let inCodeBlock = false
  let codeContent: string[] = []
  let keyCounter = 0

  const flushList = () => {
    if (currentList.length > 0) {
      const key = `list-${keyCounter++}`
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 my-2">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  const flushCode = () => {
    if (codeContent.length > 0) {
      const key = `code-${keyCounter++}`
      elements.push(
        <pre key={key} className="bg-surface-100 rounded-lg p-3 my-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
          {codeContent.join('\n')}
        </pre>
      )
      codeContent = []
    }
  }

  lines.forEach((line, i) => {
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCode()
        inCodeBlock = false
      } else {
        flushList()
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeContent.push(line)
      return
    }

    // Numbered list items
    if (/^\d+\.\s/.test(line)) {
      flushList()
      const text = line.replace(/^\d+\.\s/, '')
      elements.push(
        <div key={i} className="flex gap-2 my-1">
          <span className="text-surface-400 font-mono text-xs mt-0.5">
            {line.match(/^\d+/)?.[0]}.
          </span>
          <span>{formatInlineStyles(text)}</span>
        </div>
      )
      return
    }

    // Bullet points
    if (line.startsWith('- ')) {
      currentList.push(line.slice(2))
      return
    }

    // Sub-headings (### )
    if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h4 key={i} className="font-semibold text-surface-800 mt-4 mb-2">
          {line.slice(4)}
        </h4>
      )
      return
    }

    // Empty lines
    if (line.trim() === '') {
      flushList()
      return
    }

    // Regular paragraphs
    flushList()
    elements.push(
      <p key={i} className="my-2">
        {formatInlineStyles(line)}
      </p>
    )
  })

  flushList()
  flushCode()

  return <>{elements}</>
}

function formatInlineStyles(text: string): React.ReactNode {
  // Handle **bold** and *italic* inline
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>)
      }
      parts.push(<strong key={key++} className="font-semibold text-surface-800">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }

    // No more formatting, push rest
    parts.push(<span key={key++}>{remaining}</span>)
    break
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>
}

interface ParsedPrompt {
  title: string
  intro: string
  sections: { title: string; content: string }[]
}

function parsePromptSections(prompt: string): ParsedPrompt {
  const lines = prompt.split('\n')
  const result: ParsedPrompt = {
    title: '',
    intro: '',
    sections: [],
  }

  let currentSection: { title: string; content: string[] } | null = null
  let inIntro = true

  for (const line of lines) {
    // Main title (# )
    if (line.startsWith('# ')) {
      result.title = line.slice(2)
      continue
    }

    // Section header (## )
    if (line.startsWith('## ')) {
      if (currentSection) {
        result.sections.push({
          title: currentSection.title,
          content: currentSection.content.join('\n').trim(),
        })
      }
      currentSection = { title: line.slice(3), content: [] }
      inIntro = false
      continue
    }

    // Content
    if (inIntro && !line.startsWith('##')) {
      if (line.trim()) {
        result.intro += (result.intro ? ' ' : '') + line.trim()
      }
    } else if (currentSection) {
      currentSection.content.push(line)
    }
  }

  // Don't forget the last section
  if (currentSection) {
    result.sections.push({
      title: currentSection.title,
      content: currentSection.content.join('\n').trim(),
    })
  }

  return result
}
