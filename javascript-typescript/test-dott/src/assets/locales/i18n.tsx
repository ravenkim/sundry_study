import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import koTranslation from 'src/assets/locales/ko/ko.json'
import enTranslation from 'src/assets/locales/en/en.json'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
    ko: {
        translation: koTranslation,
    },
    en: {
        translation: enTranslation,
    },
}

const language = localStorage.getItem('i18nextLng') || 'ko'

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        supportedLngs: ['ko', 'en'],
        lng: language, //로컬 스토리지에 저장된 언어
        fallbackLng: 'en', //ko가 없으면 나오는 언어
        interpolation: {
            escapeValue: false, //리액트는 xss 방지가 따로 되어있어서 불필요
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
