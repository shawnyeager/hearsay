import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full rounded-lg border border-surface-300 bg-white px-3 py-3 text-sm text-surface-800 transition-all duration-200',
          'placeholder:text-surface-400',
          'hover:border-surface-400',
          'focus-visible:outline-none focus-visible:border-accent-500 focus-visible:shadow-[0_0_0_3px_rgba(232,111,74,0.1)]',
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
