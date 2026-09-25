'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
    Button,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
} from '@mantine/core'
import {
    IconArrowRight,
    IconBuildingEstate,
    IconCalendarOff,
    IconCoin,
    IconPlus,
    IconTool,
} from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { ENDING_SOON_DAYS } from '@/app/components/rentals/RentalCard'
import { IncomeCharts } from '@/app/components/dashboard/IncomeCharts'

import type { Maintenance, MaintenanceOverview, Rental, Repair, Residence } from '@/app/lib/types'

const MAINTENANCE_DUE_SOON_DAYS = 14
const REPAIR_COST_WINDOW_DAYS = 30

function getGreeting() {
    const hour = new Date().getHours()
    return hour < 12 ? 'Καλημέρα' : 'Καλησπέρα'
}

function StatCard({
    icon: Icon,
    color,
    value,
    label,
}: {
    icon: typeof IconBuildingEstate
    color: string
    value: string | number
    label: string
}) {
    return (
        <Card withBorder radius="lg" padding="lg">
            <Group gap="md" wrap="nowrap">
                <ThemeIcon size={44} radius="md" variant="light" color={color}>
                    <Icon size={24} />
                </ThemeIcon>
                <div>
                    <Text fw={700} size="xl" lh={1.2}>{value}</Text>
                    <Text size="sm" c="dimmed">{label}</Text>
                </div>
            </Group>
        </Card>
    )
}

export default function Dashboard() {
    const { data: residences, loading: loadingResidences, dataNotFound } = useFetch(Routes('residences').list)
    const { data: maintenances, loading: loadingMaintenances } = useFetch(Routes('maintenances').list)
    const { data: rentals, loading: loadingRentals } = useFetch(Routes('rentals').list)
    const { data: repairs, loading: loadingRepairs } = useFetch(Routes('repairs').list)

    const { GET } = useCRUD()
    const [maintenanceOverviews, setMaintenanceOverviews] = useState<Record<number, MaintenanceOverview>>({})

    useEffect(() => {
        const list = maintenances as Maintenance[]
        if (list.length === 0) return

        let cancelled = false

        Promise.all(
            list.map((maintenance) =>
                GET(Routes('maintenances').overview(String(maintenance.id)))
                    .then((overview: MaintenanceOverview) => [maintenance.id, overview] as const)
                    .catch(() => null),
            ),
        ).then((results) => {
            if (cancelled) return
            const map: Record<number, MaintenanceOverview> = {}
            results.forEach((result) => {
                if (result) map[result[0]] = result[1]
            })
            setMaintenanceOverviews(map)
        })

        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maintenances])

    if (loadingResidences || loadingMaintenances || loadingRentals || loadingRepairs) return <PageLoader />

    if (dataNotFound) {
        return (
            <Card withBorder radius="lg" padding="xl" className="relative overflow-hidden">
                <div
                    className="pointer-events-none absolute -top-24 right-[-10%] h-72 w-72 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle, #4dabf7, transparent 70%)' }}
                />
                <Stack align="center" gap="xs" py="xl" className="relative">
                    <ThemeIcon size={56} radius="xl" variant="light" color="blue">
                        <IconBuildingEstate size={28} stroke={1.5} />
                    </ThemeIcon>
                    <Title order={3} ta="center">Καλώς ήρθες!</Title>
                    <Text c="dimmed" ta="center" maw={360}>
                        Ξεκίνα προσθέτοντας το πρώτο σου ακίνητο για να δεις εδώ μια συνολική εικόνα.
                    </Text>
                    <Button
                        component={Link}
                        href="/dashboard/residences/new"
                        mt="sm"
                        rightSection={<IconArrowRight size={16} />}
                    >
                        Πρόσθεσε το πρώτο σου ακίνητο
                    </Button>
                </Stack>
            </Card>
        )
    }

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const currencyFormatter = new Intl.NumberFormat('el-GR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
    })

    const daysUntil = (date: string) =>
        Math.round((new Date(date).getTime() - new Date(today).getTime()) / 86400000)

    const endingSoonRentals = (rentals as Rental[])
        .filter((rental) => !rental.end_date || rental.end_date >= today)
        .filter((rental) => rental.end_date && daysUntil(rental.end_date) <= ENDING_SOON_DAYS)
        .sort((a, b) => a.end_date!.localeCompare(b.end_date!))

    const activeRentals = (rentals as Rental[]).filter(
        (rental) => rental.start_date <= today && (!rental.end_date || rental.end_date >= today),
    )
    const monthlyIncome = activeRentals.reduce((sum, rental) => sum + (parseFloat(rental.rent_amount) || 0), 0)

    const dueMaintenances = (maintenances as Maintenance[])
        .map((maintenance) => ({ maintenance, overview: maintenanceOverviews[maintenance.id] }))
        .filter((row): row is { maintenance: Maintenance, overview: MaintenanceOverview } => !!row.overview?.next_maintenance)
        .map((row) => ({ ...row, daysLeft: daysUntil(row.overview.next_maintenance!) }))
        .filter((row) => row.daysLeft <= MAINTENANCE_DUE_SOON_DAYS)

    const overdueMaintenancesCount = dueMaintenances.filter((row) => row.daysLeft < 0).length

    const recentRepairsCost = (repairs as Repair[])
        .filter((repair) => (now.getTime() - new Date(repair.date).getTime()) / 86400000 <= REPAIR_COST_WINDOW_DAYS)
        .reduce((sum, repair) => sum + (parseFloat(repair.cost) || 0), 0)

    return (
        <Stack gap="xl">
            <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
                <div>
                    <Title order={2}>{getGreeting()}</Title>
                    <Text c="dimmed" size="sm">Μια γρήγορη ματιά στα ακίνητά σου.</Text>
                </div>
                <Group gap="sm">
                    <Button component={Link} href="/dashboard/residences/new" leftSection={<IconPlus size={16} />}>
                        Νέο ακίνητο
                    </Button>
                    <Button
                        component={Link}
                        href="/dashboard/technicians/new"
                        variant="default"
                        leftSection={<IconPlus size={16} />}
                    >
                        Νέος τεχνικός
                    </Button>
                </Group>
            </Group>

            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                <StatCard icon={IconBuildingEstate} color="blue" value={(residences as Residence[]).length} label="Ακίνητα" />
                <StatCard
                    icon={IconCoin}
                    color="teal"
                    value={currencyFormatter.format(monthlyIncome)}
                    label="Μηνιαίο εισόδημα"
                />
                <StatCard
                    icon={IconCalendarOff}
                    color={endingSoonRentals.length > 0 ? 'orange' : 'gray'}
                    value={endingSoonRentals.length}
                    label="Συμβόλαια που λήγουν"
                />
                <StatCard
                    icon={IconTool}
                    color={overdueMaintenancesCount > 0 ? 'red' : 'gray'}
                    value={overdueMaintenancesCount}
                    label="Εκπρόθεσμες συντηρήσεις"
                />
                <StatCard icon={IconCoin} color="teal" value={`${recentRepairsCost.toFixed(2)}€`} label="Κόστος επισκευών (30 ημ.)" />
            </SimpleGrid>

            <IncomeCharts residences={residences as Residence[]} rentals={rentals as Rental[]} today={today} />
        </Stack>
    )
}
