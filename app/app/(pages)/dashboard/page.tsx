'use client'

import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"
export default function Dashboard() {

    const { data } = useFetch(Routes('residences').list)
    console.log("🚀 ~ SignIn ~ data:", data)
    return (
        <main>
            dashboard
        </main>
    )
}