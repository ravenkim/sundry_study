import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import koCommon from 'src/assets/locales/ko/common.json'
import koNav from 'src/assets/locales/ko/nav.json'
import koAuth from 'src/assets/locales/ko/auth.json'
import koReport from 'src/assets/locales/ko/report.json'
import koUser from 'src/assets/locales/ko/user.json'
import koAdmin from 'src/assets/locales/ko/admin.json'
import koAdminBuildings from 'src/assets/locales/ko/adminBuildings.json'
import koAdminSchedules from 'src/assets/locales/ko/adminSchedules.json'
import koErrors from 'src/assets/locales/ko/errors.json'
import koLegal from 'src/assets/locales/ko/legal.json'
import koNotFound from 'src/assets/locales/ko/notFound.json'
import koAbout from 'src/assets/locales/ko/about.json'
import koRanking from 'src/assets/locales/ko/ranking.json'

import enCommon from 'src/assets/locales/en/common.json'
import enNav from 'src/assets/locales/en/nav.json'
import enAuth from 'src/assets/locales/en/auth.json'
import enReport from 'src/assets/locales/en/report.json'
import enUser from 'src/assets/locales/en/user.json'
import enAdmin from 'src/assets/locales/en/admin.json'
import enAdminBuildings from 'src/assets/locales/en/adminBuildings.json'
import enAdminSchedules from 'src/assets/locales/en/adminSchedules.json'
import enErrors from 'src/assets/locales/en/errors.json'
import enLegal from 'src/assets/locales/en/legal.json'
import enNotFound from 'src/assets/locales/en/notFound.json'
import enAbout from 'src/assets/locales/en/about.json'
import enRanking from 'src/assets/locales/en/ranking.json'

export const I18N_NAMESPACES = [
    'common',
    'nav',
    'auth',
    'report',
    'user',
    'admin',
    'adminBuildings',
    'adminSchedules',
    'errors',
    'legal',
    'notFound',
    'about',
    'ranking',
] as const

export type I18nNamespace = (typeof I18N_NAMESPACES)[number]

const resources = {
    ko: {
        common: koCommon,
        nav: koNav,
        auth: koAuth,
        report: koReport,
        user: koUser,
        admin: koAdmin,
        adminBuildings: koAdminBuildings,
        adminSchedules: koAdminSchedules,
        errors: koErrors,
        legal: koLegal,
        notFound: koNotFound,
        about: koAbout,
        ranking: koRanking,
    },
    en: {
        common: enCommon,
        nav: enNav,
        auth: enAuth,
        report: enReport,
        user: enUser,
        admin: enAdmin,
        adminBuildings: enAdminBuildings,
        adminSchedules: enAdminSchedules,
        errors: enErrors,
        legal: enLegal,
        notFound: enNotFound,
        about: enAbout,
        ranking: enRanking,
    },
}

i18n.use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        supportedLngs: ['ko', 'en'],
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: [...I18N_NAMESPACES],
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    })

export default i18n
