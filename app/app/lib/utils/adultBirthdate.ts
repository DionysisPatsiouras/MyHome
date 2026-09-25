// Use UTC to match the API and PostgreSQL's date boundary.
export function adultBirthdateCutoff(now = new Date()): string {
    const year = now.getUTCFullYear() - 18
    const month = now.getUTCMonth()
    const day = Math.min(
        now.getUTCDate(),
        new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
    )

    return `${year.toString().padStart(4, '0')}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function isAdultBirthdate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

    const parsed = new Date(`${value}T00:00:00Z`)
    return !Number.isNaN(parsed.getTime())
        && parsed.toISOString().slice(0, 10) === value
        && value <= adultBirthdateCutoff()
}
