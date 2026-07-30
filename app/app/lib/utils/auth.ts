import { getCookie } from "@/app/lib/utils/cookies"

export const getCurrentUserId = async (): Promise<string | null> => {
    const token = getCookie("token")
    if (!token) return null

    const decoded = JSON.parse(atob(token.split(".")[1]))
    return decoded?.user_id ?? null
}
