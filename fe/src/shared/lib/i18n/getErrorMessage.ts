import { isAxiosError } from 'axios'
import i18n from 'src/assets/locales/i18n'

export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const serverMsg = (error.response?.data as { message?: string })
            ?.message
        return (
            serverMsg ||
            error.message ||
            i18n.t('errors:networkUnavailable')
        )
    }
    if (error instanceof Error) {
        return error.message || i18n.t('errors:requestFailed')
    }
    return i18n.t('errors:requestFailed')
}
