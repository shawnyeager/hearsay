interface HearsayLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function HearsayLogo({ size = 'md', className = '' }: HearsayLogoProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Speech bubble that subtly forms an ear shape */}
        {/* Outer bubble - warm gradient */}
        <defs>
          <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e86f4a" />
            <stop offset="100%" stopColor="#d4532e" />
          </linearGradient>
          <linearGradient id="innerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fef7f4" />
            <stop offset="100%" stopColor="#fdeee7" />
          </linearGradient>
        </defs>

        {/* Main speech bubble shape - organic, ear-like curve */}
        <path
          d="M20 4C10.5 4 4 11 4 19c0 4.5 2 8.5 5.5 11.5C8.5 33 7 36 7 36s5-1.5 8-3.5c1.5.3 3.2.5 5 .5 9.5 0 16-7 16-14S29.5 4 20 4z"
          fill="url(#bubbleGradient)"
        />

        {/* Inner ear-like spiral/curve - suggests listening */}
        <path
          d="M20 10c-5 0-9 4-9 9 0 3 1.5 5.5 4 7"
          stroke="url(#innerGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Inner accent curve - the cochlea hint */}
        <path
          d="M20 14c-2.8 0-5 2.2-5 5 0 1.8 1 3.4 2.5 4.2"
          stroke="url(#innerGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Small dot - focal point */}
        <circle
          cx="20"
          cy="19"
          r="2"
          fill="url(#innerGradient)"
          opacity="0.9"
        />
      </svg>
    </div>
  )
}

// Wordmark variant for larger displays
export function HearsayWordmark({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HearsayLogo size="md" />
      <span className="font-display text-xl font-semibold text-surface-900 tracking-tight">
        Hearsay
      </span>
    </div>
  )
}
