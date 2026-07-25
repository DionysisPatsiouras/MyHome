'use client'

import { Stack } from '@mantine/core'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { RentalCard } from '@/app/components/rentals/RentalCard'
import { useResidence } from '@/app/contexts/ResidenceContext'

import type { Rental } from '@/app/lib/types'

export default function Contracts() {
    const { residence } = useResidence()
    const { data: rentals, loading } = useFetch(Routes('rentals').list)

    if (loading) return <PageLoader />

    const residenceRentals = ((rentals as Rental[]) ?? []).filter(
        (rental) => rental.residence.id === residence?.id,
    )

    if (residenceRentals.length === 0) {
        return (
            <DataNotFound
                title="Δεν υπάρχουν μισθωτήρια"
                description="Δεν έχει καταχωρηθεί κάποιο μισθωτήριο για αυτό το ακίνητο."
            />
        )
    }

    return (
        <Stack gap="md">
            {residenceRentals.map((rental) => (
                <RentalCard key={rental.id} rental={rental} showResidence={false} />
            ))}
        </Stack>
    )
}
