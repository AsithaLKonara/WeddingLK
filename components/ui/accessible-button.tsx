import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  ariaPressed?: boolean
  ariaControls?: string
  ariaHaspopup?: boolean
  ariaLive?: 'off' | 'polite' | 'assertive'
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ariaLabel,
      ariaDescribedBy,
      ariaExpanded,
      ariaPressed,
      ariaControls,
      ariaHaspopup,
      ariaLive,
      ...props
    },
    ref
  ) => {
    // Determine if button should be disabled
    const isDisabled = disabled || loading

    // Generate accessible name
    const accessibleName = ariaLabel || (typeof children === 'string' ? children : undefined)

    // Base classes
    const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    // Variant classes
    const variantClasses = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline'
    }

    // Size classes
    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10'
    }

    // Combine classes
    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )

    // ARIA attributes
    const ariaAttributes = {
      'aria-label': accessibleName,
      'aria-describedby': ariaDescribedBy,
      'aria-expanded': ariaExpanded,
      'aria-pressed': ariaPressed,
      'aria-controls': ariaControls,
      'aria-haspopup': ariaHaspopup,
      'aria-live': ariaLive,
      'aria-disabled': isDisabled,
      'aria-busy': loading,
      ...(loading && { 'aria-label': `${accessibleName || 'Button'}, loading` })
    }

    // Remove undefined values
    Object.keys(ariaAttributes).forEach(key => {
      if (ariaAttributes[key as keyof typeof ariaAttributes] === undefined) {
        delete ariaAttributes[key as keyof typeof ariaAttributes]
      }
    })

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={isDisabled}
        {...ariaAttributes}
        {...props}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {/* Content */}
        {children && (
          <span className={cn(loading && 'sr-only')}>
            {children}
          </span>
        )}

        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="inline-flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}

        {/* Screen reader only text for icon buttons */}
        {size === 'icon' && !accessibleName && (
          <span className="sr-only">Button</span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export { AccessibleButton }
