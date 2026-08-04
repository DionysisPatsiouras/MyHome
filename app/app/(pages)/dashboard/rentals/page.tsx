'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Alert, Badge, Button, Group, MultiSelect, Stack, Tabs, Text, Title } from '@mantine/core'
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates'
import { IconAlertTriangle, IconCalendarOff, IconPlus, IconX } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { ENDING_SOON_DAYS, RentalCard } from '@/app/components/rentals/RentalCard'

import type { Rental } from '@/app/lib/types'

export default function Rentals() {

    const { data: rentals, loading, dataNotFound } = useFetch(Routes('rentals').list)

    const [selectedResidenceIds, setSelectedResidenceIds] = useState<string[]>([])
    const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([])
    const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null])

    const today = new Date().toISOString().slice(0, 10)

    const daysUntil = (date: string) =>
        Math.round((new Date(date).getTime() - new Date(today).getTime()) / 86400000)

    const renderResidence = (residence: Rental['residence']) =>
        `${residence.address} ${residence.road_number ?? ''}`.trim()

    const residenceOptions = Array.from(
        new Map(
            (rentals as Rental[]).map((rental) => [rental.residence.id, renderResidence(rental.residence)]),
        ),
    ).map(([id, label]) => ({ value: String(id), label }))

    const tenantOptions = Array.from(
        new Map(
            (rentals as Rental[]).map((rental) => [String(rental.tenant.id), `${rental.tenant.first_name} ${rental.tenant.last_name}`]),
        ),
    ).map(([value, label]) => ({ value, label }))

    const [rangeStart, rangeEnd] = dateRange

    const hasActiveFilters = selectedResidenceIds.length > 0 || selectedTenantIds.length > 0 || Boolean(rangeStart || rangeEnd)

    const clearFilters = () => {
        setSelectedResidenceIds([])
        setSelectedTenantIds([])
        setDateRange([null, null])
    }

    const filteredRentals = (rentals as Rental[])
        .filter((rental) => selectedResidenceIds.length === 0 || selectedResidenceIds.includes(String(rental.residence.id)))
        .filter((rental) => selectedTenantIds.length === 0 || selectedTenantIds.includes(String(rental.tenant.id)))
        .filter((rental) => {
            if (!rangeStart && !rangeEnd) return true
            if (rangeStart && rental.end_date && rental.end_date < rangeStart) return false
            if (rangeEnd && rental.start_date > rangeEnd) return false
            return true
        })

    const currentRentals = filteredRentals
        .filter((rental) => !rental.end_date || rental.end_date >= today)
        .sort((a, b) => (a.end_date ?? '9999-12-31').localeCompare(b.end_date ?? '9999-12-31'))

    const pastRentals = filteredRentals
        .filter((rental) => rental.end_date && rental.end_date < today)
        .sort((a, b) => b.end_date!.localeCompare(a.end_date!))

    const endingSoonRentals = currentRentals.filter(
        (rental) => rental.end_date && daysUntil(rental.end_date) <= ENDING_SOON_DAYS,
    )

    const ENDING_SOON_VISIBLE = 3
    const visibleEndingSoonRentals = endingSoonRentals.slice(0, ENDING_SOON_VISIBLE)
    const hiddenEndingSoonCount = endingSoonRentals.length - visibleEndingSoonRentals.length

    const renderCards = (rows: Rental[], emptyText: string) => {
        if (rows.length === 0) {
            return <DataNotFound title={emptyText} />
        }

        return (
            <Stack gap="md">
                {rows.map((rental) => <RentalCard key={rental.id} rental={rental} />)}
            </Stack>
        )
    }

    if (loading) return <PageLoader />

    if (dataNotFound) {
        return (
            <DataNotFound
                icon={IconCalendarOff}
                title="Δεν υπάρχουν μισθωτήρια"
                description="Δεν έχετε προσθέσει ακόμα κάποιο μισθωτήριο."
                actionLabel="Νέο μισθωτήριο"
                actionHref="/dashboard/rentals/new"
            />
        )
    }

    return (
        <Stack gap="lg">

            <Group justify="space-between">
                <Group gap="xs" align="center">
                    <Title order={2}>Μισθωτήρια</Title>
                    <Badge variant="light" color="blue" size="lg" circle>
                        {(rentals as Rental[]).length}
                    </Badge>
                </Group>
                <Button component={Link} href="/dashboard/rentals/new" leftSection={<IconPlus size={16} />}>
                    Νέο μισθωτήριο
                </Button>
            </Group>

            <Group gap="sm">
                <MultiSelect
                    placeholder="Ακίνητα"
                    data={residenceOptions}
                    value={selectedResidenceIds}
                    onChange={setSelectedResidenceIds}
                    searchable
                    clearable
                    style={{ flex: 1 }}
                />
                <MultiSelect
                    placeholder="Ενοικιαστές"
                    data={tenantOptions}
                    value={selectedTenantIds}
                    onChange={setSelectedTenantIds}
                    searchable
                    clearable
                    style={{ flex: 1 }}
                />
                <DatePickerInput
                    type="range"
                    placeholder="Περίοδος μίσθωσης"
                    valueFormat="DD/MM/YYYY"
                    firstDayOfWeek={1}
                    value={dateRange}
                    onChange={setDateRange}
                    clearable
                    w={260}
                />
                {hasActiveFilters && (
                    <Button
                        variant="subtle"
                        color="gray"
                        leftSection={<IconX size={16} />}
                        onClick={clearFilters}
                    >
                        Καθαρισμός φίλτρων
                    </Button>
                )}
            </Group>

            {endingSoonRentals.length > 0 && (
                <Alert
                    variant="light"
                    color="orange"
                    icon={<IconAlertTriangle size={18} />}
                    title={`${endingSoonRentals.length} μισθωτήρι${endingSoonRentals.length === 1 ? 'ο λήγει' : 'α λήγουν'} σύντομα`}
                >
                    <Stack gap={4}>
                        {visibleEndingSoonRentals.map((rental) => (
                            <Text key={rental.id} size="sm">
                                {renderResidence(rental.residence)} — {rental.tenant.first_name} {rental.tenant.last_name}{' '}
                                ({new Date(rental.end_date!).toLocaleDateString('el-GR')},{' '}
                                {daysUntil(rental.end_date!) === 0 ? 'σήμερα' : `σε ${daysUntil(rental.end_date!)} ημέρες`})
                            </Text>
                        ))}
                        {hiddenEndingSoonCount > 0 && (
                            <Text size="sm" fw={500}>
                                +{hiddenEndingSoonCount} ακόμα
                            </Text>
                        )}
                    </Stack>
                </Alert>
            )}

            <Tabs defaultValue="current">
                <Tabs.List>
                    <Tabs.Tab value="current">
                        Ενεργά ({currentRentals.length})
                    </Tabs.Tab>
                    <Tabs.Tab value="past">
                        Παλαιότερα ({pastRentals.length})
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="current" pt="md">
                    {renderCards(currentRentals, 'Δεν υπάρχουν τρέχοντα μισθωτήρια')}
                </Tabs.Panel>

                <Tabs.Panel value="past" pt="md">
                    {renderCards(pastRentals, 'Δεν υπάρχουν παλαιότερα μισθωτήρια')}
                </Tabs.Panel>
            </Tabs>

        </Stack>
    )
}
