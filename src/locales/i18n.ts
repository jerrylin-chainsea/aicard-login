import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhTW from './zh-TW.json'
import zhCN from './zh-CN.json'
import enUS from './en-US.json'

const resources = {
  'zh-TW': {
    translation: zhTW,
  },
  'zh-CN': {
    translation: zhCN,
  },
  'en-US': {
    translation: enUS,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-TW', // 預設語言
    fallbackLng: 'zh-TW',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
