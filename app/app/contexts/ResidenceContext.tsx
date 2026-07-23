'use client'

import { createContext, useContext } from 'react'
import { useParams } from 'next/navigation'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import type { Residence, Maintenance } from '@/app/lib/types'

interface ResidenceContextValue {
    residence: Residence | null
    loading: boolean
    notFound: boolean
    maintenances: Maintenance[]
    refetchResidence: () => void
}

const ResidenceContext = createContext<ResidenceContextValue | null>(null)

export function ResidenceProvider({ children }: { children: React.ReactNode }) {
    const { id } = useParams()

    const { data, loading, dataNotFound, fetchData } = useFetch(Routes('residences').id(String(id)))
    const residence = (data as unknown as Residence) ?? null
    const notFound = dataNotFound || (!loading && !residence)

    const { data: maintenancesData } = useFetch(Routes('maintenances').list)
    const maintenances = (maintenancesData as unknown as Maintenance[]) ?? []

    return (
        <ResidenceContext.Provider value={{ residence, loading, notFound, maintenances, refetchResidence: fetchData }}>
            {children}
        </ResidenceContext.Provider>
    )
}

export function useResidence(): ResidenceContextValue {
    const ctx = useContext(ResidenceContext)
    if (!ctx) throw new Error('useResidence must be used inside ResidenceProvider')
    return ctx
}
