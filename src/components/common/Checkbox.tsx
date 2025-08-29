import React from 'react'
import { Checkbox as AntCheckbox } from 'antd-mobile'
import type { CheckboxProps as AntCheckboxProps } from 'antd-mobile'

export interface ICheckboxProps extends Omit<AntCheckboxProps, 'children'> {
  children: React.ReactNode
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

const Checkbox: React.FC<ICheckboxProps> = ({
  children,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'flex items-center space-x-2'
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const combinedClasses = `${baseClasses} ${disabledClasses} ${className}`.trim()

  return (
    <label className={combinedClasses}>
      <AntCheckbox
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span className="text-sm text-gray-700">{children}</span>
    </label>
  )
}

export default Checkbox
