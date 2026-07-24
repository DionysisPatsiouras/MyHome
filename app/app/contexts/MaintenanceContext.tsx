'use client'

import { createContext, useContext, useState } from 'react'

import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import type { Maintenance, MaintenanceHistoryEntry, MaintenanceOverview } from '@/app/lib/types'
import type { NewMaintenanceHistoryFormValues } from '@/app/lib/utils/formSchemas'

interface MaintenanceContextValue {
    maintenance: Maintenance
    overview: MaintenanceOverview | null
    loading: boolean
    fetchOverview: () => Promise<void>
    logHistory: (values: NewMaintenanceHistoryFormValues, entry?: MaintenanceHistoryEntry | null) => Promise<void>
    deleteHistory: (entry: MaintenanceHistoryEntry) => Promise<void>
}

const MaintenanceContext = createContext<MaintenanceContextValue | null>(null)

export function MaintenanceProvider({ maintenance, children }: { maintenance: Maintenance, children: React.ReactNode }) {
    const { GET, POST, PATCH, DELETE } = useCRUD()

    const [overview, setOverview] = useState<MaintenanceOverview | null>(null)
    const [loading, setLoading] = useState(false)

    const fetchOverview = async () => {
        setLoading(true)
        try {
            const data: MaintenanceOverview = await GET(Routes('maintenances').overview(String(maintenance.id)))
            setOverview(data)
        } finally {
            setLoading(false)
        }
    }

    const logHistory = async (values: NewMaintenanceHistoryFormValues, entry?: MaintenanceHistoryEntry | null) => {
        if (entry) {
            await PATCH(Routes('maintenances/history').patch(String(entry.id)), values, false, {
                success: { title: 'Επιτυχία', message: 'Η συντήρηση ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση της συντήρησης' },
            })
        } else {
            await POST(Routes('maintenances/history').add, { ...values, maintenanceId: maintenance.id }, false, {
                success: { title: 'Επιτυχία', message: 'Η συντήρηση καταχωρήθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η καταχώρηση της συντήρησης' },
            })
        }
        await fetchOverview()
    }

    const deleteHistory = async (entry: MaintenanceHistoryEntry) => {
        await DELETE(Routes('maintenances/history').delete(String(entry.id)))
        await fetchOverview()
    }

    return (
        <MaintenanceContext.Provider value={{ maintenance, overview, loading, fetchOverview, logHistory, deleteHistory }}>
            {children}
        </MaintenanceContext.Provider>
    )
}

export function useMaintenance(): MaintenanceContextValue {
    const ctx = useContext(MaintenanceContext)
    if (!ctx) throw new Error('useMaintenance must be used inside MaintenanceProvider')
    return ctx
}
