import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border border-surface-700 bg-surface-900/50 px-3 py-3 text-sm text-surface-100 transition-all duration-200',
          'placeholder:text-surface-500',
          'hover:border-surface-600 hover:bg-surface-900/70',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:border-accent-500/50 focus-visible:bg-surface-900',
          'disabled:cursor-not-allowed disabled:opacity-40',
          'resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
