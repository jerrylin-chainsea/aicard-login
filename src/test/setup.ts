import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock antd-mobile
vi.mock('antd-mobile', () => ({
  Button: ({ children, ...props }: any) => {
    const button = document.createElement('button')
    Object.assign(button, props)
    if (children) button.textContent = children
    return button
  },
  Input: ({ ...props }: any) => {
    const input = document.createElement('input')
    Object.assign(input, props)
    return input
  },
  Checkbox: ({ children, ...props }: any) => {
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.type = 'checkbox'
    Object.assign(input, props)
    label.appendChild(input)
    if (children) label.appendChild(document.createTextNode(children))
    return label
  },
  Toast: {
    show: vi.fn(),
  },
  ConfigProvider: ({ children }: any) => {
    const div = document.createElement('div')
    if (children) div.appendChild(children)
    return div
  },
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  }
})

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options && typeof options === 'object') {
        // 處理插值變數
        let result = key
        Object.keys(options).forEach(k => {
          result = result.replace(new RegExp(`{{${k}}}`, 'g'), options[k])
        })
        return result
      }
      return key
    },
    i18n: {
      changeLanguage: vi.fn(),
    },
  }),
}))

// Mock Redux
vi.mock('@/app/hooks', () => ({
  useAppDispatch: () => vi.fn(),
  useAppSelector: vi.fn(),
}))

// 全域測試設定
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
