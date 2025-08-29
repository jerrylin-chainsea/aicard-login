import React from 'react'
import { Input as AntInput } from 'antd-mobile'
import type { InputProps as AntInputProps } from 'antd-mobile'

export interface IInputProps extends Omit<AntInputProps, 'children'> {
  label?: string
  error?: string
  helperText?: string
  required?: boolean
  className?: string
}

const Input: React.FC<IInputProps> = ({
  label,
  error,
  helperText,
  required = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full'
  const errorClasses = error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
  const combinedClasses = `${baseClasses} ${errorClasses} ${className}`.trim()

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <AntInput
        className={combinedClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Input
