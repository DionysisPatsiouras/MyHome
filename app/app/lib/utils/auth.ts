export const getCurrentUserId = async (): Promise<string | null> => {
    const token = await cookieStore.get("token")
    if (!token?.value) return null

    const decoded = JSON.parse(atob(token.value.split(".")[1]))
    return decoded?.user_id ?? null
}
