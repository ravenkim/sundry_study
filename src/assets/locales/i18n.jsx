import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import koTranslation from 'src/assets/locales/ko/ko.json';
import enTranslation from 'src/assets/locales/en/en.json';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    ko: {
        translation: koTranslation
    },
    en: {
        translation: enTranslation
    },
}

const language = localStorage.getItem('language') || 'ko';



i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        lng: 'language',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    })

export default i18n
