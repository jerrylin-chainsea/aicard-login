import React from 'react'
import { Button as AntButton } from 'antd-mobile'
import type { ButtonProps as AntButtonProps } from 'antd-mobile'

export interface IButtonProps extends Omit<AntButtonProps, 'children'> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
}

const Button: React.FC<IButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    // 如果傳入了自定義的 className，減少 Tailwind 樣式的干擾
    if (className.includes('welcome-page__login-button')) {
      return ''
    }
    
    switch (variant) {
      case 'primary':
        return 'bg-line-green text-white hover:bg-green-600 active:bg-green-700'
      case 'secondary':
        return 'bg-white text-black border border-gray-300 hover:bg-gray-50 active:bg-gray-100'
      case 'outline':
        return 'bg-transparent text-line-green border border-line-green hover:bg-green-50 active:bg-green-100'
      default:
        return 'bg-line-green text-white hover:bg-green-600 active:bg-green-700'
    }
  }

  const getSizeClasses = () => {
    // 如果傳入了自定義的 className，減少 Tailwind 樣式的干擾
    if (className.includes('welcome-page__login-button')) {
      return ''
    }
    
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm'
      case 'medium':
        return 'px-4 py-3 text-base'
      case 'large':
        return 'px-6 py-4 text-lg'
      default:
        return 'px-4 py-3 text-base'
    }
  }

  const baseClasses = className.includes('welcome-page__login-button') ? '' : 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
  const variantClasses = getVariantClasses()
  const sizeClasses = getSizeClasses()
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const loadingClasses = loading ? 'cursor-wait' : ''

  const combinedClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${loadingClasses} ${className}`.trim()

  return (
    <AntButton
      className={combinedClasses}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </AntButton>
  )
}

export default Button
