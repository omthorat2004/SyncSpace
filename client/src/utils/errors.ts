import { AxiosError } from 'axios'

/**
 * Pull a human-readable message out of a thrown value, preferring the
 * backend's `message`/`detail` field on Axios errors.
 */
export const extractErrorMessage = (err: unknown, fallbackMessage: string): string => {
    if (err instanceof AxiosError) {
        const backendMessage = err.response?.data as { message?: string; detail?: string } | undefined
        if (backendMessage?.message) {
            return backendMessage.message
        }
        if (backendMessage?.detail) {
            return backendMessage.detail
        }
        if (err.message) {
            return err.message
        }
    }

    if (err instanceof Error) {
        return err.message
    }

    return fallbackMessage
}
