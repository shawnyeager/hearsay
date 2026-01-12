import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950',
          'disabled:pointer-events-none disabled:opacity-40',
          'active:scale-[0.97]',
          {
            // Primary - strong amber accent
            'bg-gradient-to-b from-accent-500 to-accent-600 text-surface-950 font-semibold shadow-md shadow-accent-500/20 hover:from-accent-400 hover:to-accent-500 hover:shadow-lg hover:shadow-accent-500/30':
              variant === 'default',
            // Secondary - subtle surface
            'bg-surface-800 text-surface-200 border border-surface-700 hover:bg-surface-700 hover:text-surface-100 hover:border-surface-600':
              variant === 'secondary',
            // Outline - bordered
            'border border-surface-700 bg-transparent text-surface-300 hover:bg-surface-800/50 hover:text-surface-100 hover:border-surface-600':
              variant === 'outline',
            // Ghost - minimal
            'text-surface-400 hover:bg-surface-800/50 hover:text-surface-200':
              variant === 'ghost',
            // Destructive - danger
            'bg-gradient-to-b from-red-500 to-red-600 text-white font-semibold shadow-md shadow-red-500/20 hover:from-red-400 hover:to-red-500':
              variant === 'destructive',
            // Accent - glowing
            'bg-gradient-to-b from-accent-500 to-accent-600 text-surface-950 font-semibold glow-accent hover:from-accent-400 hover:to-accent-500':
              variant === 'accent',
          },
          {
            'h-10 px-5 py-2': size === 'default',
            'h-8 rounded-md px-3.5 text-xs': size === 'sm',
            'h-12 rounded-xl px-7 text-base': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
