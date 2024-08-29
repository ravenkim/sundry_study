import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
    ko: {
        translation: {
            'Welcome to React': '어서오시라요',
            'aaaaa': '1111111111111',

        },
    },

    en: {
        translation: {
            'Welcome to React': 'Welcome to React and react-i18next',
            'aaaaa': '22222222222222222222',
        },
    },

}

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: 'ko',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    })

export default i18n
