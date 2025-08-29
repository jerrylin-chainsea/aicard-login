import React from 'react'
import { Toast as AntToast } from 'antd-mobile'

export interface IToastProps {
  content: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  position?: 'top' | 'center' | 'bottom'
}

const Toast: React.FC<IToastProps> = ({
  content,
  type = 'info',
  duration = 3000,
  position = 'center',
}) => {
  const showToast = () => {
    switch (type) {
      case 'success':
        AntToast.show({
          content,
          duration,
          position,
          icon: 'success',
        })
        break
      case 'error':
        AntToast.show({
          content,
          duration,
          position,
          icon: 'fail',
        })
        break
      case 'warning':
        AntToast.show({
          content,
          duration,
          position,
          icon: 'loading',
        })
        break
      default:
        AntToast.show({
          content,
          duration,
          position,
        })
    }
  }

  React.useEffect(() => {
    showToast()
  }, [content, type, duration, position])

  return null
}

export default Toast
