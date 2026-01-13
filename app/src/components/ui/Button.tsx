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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-100',
          'disabled:pointer-events-none disabled:opacity-40',
          'active:scale-[0.97]',
          {
            // Primary - warm coral gradient
            'bg-gradient-to-b from-accent-500 to-accent-600 text-white font-semibold shadow-md shadow-accent-500/20 hover:from-accent-400 hover:to-accent-500 hover:shadow-lg hover:shadow-accent-500/25':
              variant === 'default',
            // Secondary - warm surface
            'bg-surface-200 text-surface-700 border border-surface-300 hover:bg-surface-300 hover:text-surface-800 hover:border-surface-400':
              variant === 'secondary',
            // Outline - bordered
            'border border-surface-300 bg-transparent text-surface-700 hover:bg-surface-100 hover:text-surface-800 hover:border-surface-400':
              variant === 'outline',
            // Ghost - minimal
            'text-surface-600 hover:bg-surface-100 hover:text-surface-800':
              variant === 'ghost',
            // Destructive - warm amber (less alarming)
            'bg-gradient-to-b from-amber-500 to-amber-600 text-white font-semibold shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500':
              variant === 'destructive',
            // Accent - glowing warm
            'bg-gradient-to-b from-accent-500 to-accent-600 text-white font-semibold glow-accent hover:from-accent-400 hover:to-accent-500':
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
