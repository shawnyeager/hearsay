import { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react'

interface AnalysisOutputProps {
  content: string
  isStreaming?: boolean
}

interface Section {
  title: string
  content: string
  level: number
}

export function AnalysisOutput({ content, isStreaming }: AnalysisOutputProps) {
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set())
  const [copiedSection, setCopiedSection] = useState<number | null>(null)
  const [copiedAll, setCopiedAll] = useState(false)

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Parse content into sections based on H2 headers
  const sections = useMemo(() => {
    if (!content) return []

    const lines = content.split('\n')
    const result: Section[] = []
    let currentSection: Section | null = null
    let buffer: string[] = []

    const flushBuffer = () => {
      if (currentSection) {
        currentSection.content = buffer.join('\n').trim()
        if (currentSection.content || currentSection.title) {
          result.push(currentSection)
        }
      } else if (buffer.length > 0) {
        // Content before first header
        result.push({
          title: '',
          content: buffer.join('\n').trim(),
          level: 0,
        })
      }
      buffer = []
    }

    for (const line of lines) {
      // Check for H2 headers (## )
      const h2Match = line.match(/^##\s+(.+)$/)
      if (h2Match && !isStreaming) {
        flushBuffer()
        currentSection = {
          title: h2Match[1],
          content: '',
          level: 2,
        }
      } else {
        buffer.push(line)
      }
    }

    flushBuffer()
    return result
  }, [content, isStreaming])

  const toggleSection = (index: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const copySection = async (index: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(index)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // If streaming or no clear sections, render as plain markdown
  if (isStreaming || sections.length <= 1) {
    return (
      <div className="prose-analysis">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="typing-cursor" />}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Copy all button */}
      <div className="flex justify-end">
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-surface-500 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-colors"
        >
          {copiedAll ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy all
            </>
          )}
        </button>
      </div>

      {sections.map((section, index) => {
        const isCollapsed = collapsedSections.has(index)
        const isCopied = copiedSection === index

        // Section without title (intro content)
        if (!section.title) {
          return (
            <div key={index} className="prose-analysis">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          )
        }

        return (
          <div
            key={index}
            className="border border-surface-200 rounded-lg overflow-hidden bg-white"
          >
            {/* Section header */}
            <button
              onClick={() => toggleSection(index)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-surface-50 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-surface-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-surface-400 flex-shrink-0" />
              )}
              <span className="font-display font-semibold text-surface-800 flex-1">
                {section.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copySection(index, `## ${section.title}\n\n${section.content}`)
                }}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                title="Copy section"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </button>

            {/* Section content */}
            {!isCollapsed && (
              <div className="px-4 pb-4 pt-0 prose-analysis border-t border-surface-100">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
