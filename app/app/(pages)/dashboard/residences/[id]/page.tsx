'use client'

import { useParams } from "next/navigation"

import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"

export default function ResidenceView() {

    const { id } = useParams()


    const { data } = useFetch(Routes('residences').id(String(id)))
    console.log("🚀 ~ ResidenceView ~ data:", data)


    return (
        <main className="flex gap-3">

            <section className="col-3">
                map here
            </section>

            <section className="col-9">
                info
            </section>

        </main>
    )
}