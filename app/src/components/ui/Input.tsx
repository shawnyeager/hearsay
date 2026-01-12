import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-800 transition-all duration-200',
          'placeholder:text-surface-400',
          'hover:border-surface-400',
          'focus-visible:outline-none focus-visible:border-accent-500 focus-visible:shadow-[0_0_0_3px_rgba(232,111,74,0.1)]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
