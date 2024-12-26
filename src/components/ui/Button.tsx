import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'relative flex items-center justify-center',
        'transition-all duration-200 ease-out',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'primary': 'bg-[url(/assets/ui/button.png)] bg-cover bg-no-repeat',
          'secondary': 'bg-[url(/assets/ui/button-secondary.png)] bg-cover bg-no-repeat',
        }[variant],
        {
          'sm': 'w-32 h-10 text-sm',
          'md': 'w-40 h-12 text-base',
          'lg': 'w-48 h-14 text-lg',
        }[size],
        className
      )}
      {...props}
    />
  )
})

Button.displayName = 'Button'

export default Button 