'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import {
    Badge,
    Button,
    Card,
    Group,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    UnstyledButton,
} from '@mantine/core'
import {
    IconArrowRight,
    IconBuildingEstate,
    IconCalendarOff,
    IconCoin,
    IconHammer,
    IconPlus,
    IconTool,
} from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { ENDING_SOON_DAYS, RentalCard } from '@/app/components/rentals/RentalCard'

import type { Maintenance, MaintenanceOverview, Rental, Repair, Residence } from '@/app/lib/types'

const MAINTENANCE_DUE_SOON_DAYS = 14
const REPAIR_COST_WINDOW_DAYS = 30
const WIDGET_ITEM_LIMIT = 4

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
    const today = now.toISOString().slice(0, 10)

    const daysUntil = (date: string) =>
        Math.round((new Date(date).getTime() - new Date(today).getTime()) / 86400000)

    const endingSoonRentals = (rentals as Rental[])
        .filter((rental) => !rental.end_date || rental.end_date >= today)
        .filter((rental) => rental.end_date && daysUntil(rental.end_date) <= ENDING_SOON_DAYS)
        .sort((a, b) => a.end_date!.localeCompare(b.end_date!))

    const dueMaintenances = (maintenances as Maintenance[])
        .map((maintenance) => ({ maintenance, overview: maintenanceOverviews[maintenance.id] }))
        .filter((row): row is { maintenance: Maintenance, overview: MaintenanceOverview } => !!row.overview?.next_maintenance)
        .map((row) => ({ ...row, daysLeft: daysUntil(row.overview.next_maintenance!) }))
        .filter((row) => row.daysLeft <= MAINTENANCE_DUE_SOON_DAYS)
        .sort((a, b) => a.daysLeft - b.daysLeft)

    const overdueMaintenancesCount = dueMaintenances.filter((row) => row.daysLeft < 0).length

    const recentRepairs = [...(repairs as Repair[])]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, WIDGET_ITEM_LIMIT)

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

            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                <StatCard icon={IconBuildingEstate} color="blue" value={(residences as Residence[]).length} label="Ακίνητα" />
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

            <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg">
                <Card withBorder radius="lg" padding="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>Συμβόλαια που λήγουν</Title>
                        <Button component={Link} href="/dashboard/rentals" variant="subtle" size="xs">
                            Όλα
                        </Button>
                    </Group>

                    {endingSoonRentals.length === 0 && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Δεν υπάρχουν συμβόλαια που λήγουν σύντομα</Text>
                    )}

                    <Stack gap="xs">
                        {endingSoonRentals.slice(0, WIDGET_ITEM_LIMIT).map((rental) => (
                            <RentalCard key={rental.id} rental={rental} />
                        ))}
                    </Stack>
                </Card>

                <Card withBorder radius="lg" padding="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>Εκπρόθεσμες συντηρήσεις</Title>
                    </Group>

                    {dueMaintenances.length === 0 && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Δεν υπάρχουν συντηρήσεις σε εκκρεμότητα</Text>
                    )}

                    <Stack gap="xs">
                        {dueMaintenances.slice(0, WIDGET_ITEM_LIMIT).map(({ maintenance, overview, daysLeft }) => (
                            <UnstyledButton
                                key={maintenance.id}
                                component={Link}
                                href={`/dashboard/residences/${maintenance.residence}`}
                                p="sm"
                                className="rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Group justify="space-between" wrap="nowrap">
                                    <Group gap="sm" wrap="nowrap">
                                        <ThemeIcon size={36} radius="md" variant="light" color={daysLeft < 0 ? 'red' : 'orange'}>
                                            <IconTool size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={600} size="sm">{maintenance.title}</Text>
                                            <Text size="xs" c="dimmed">
                                                {new Date(overview.next_maintenance!).toLocaleDateString('el-GR')}
                                            </Text>
                                        </div>
                                    </Group>
                                    <Badge variant="light" color={daysLeft < 0 ? 'red' : 'orange'} size="sm">
                                        {daysLeft < 0 ? 'Εκπρόθεσμη' : daysLeft === 0 ? 'Σήμερα' : `σε ${daysLeft} ημέρες`}
                                    </Badge>
                                </Group>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </Card>

                <Card withBorder radius="lg" padding="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>Πρόσφατες επισκευές</Title>
                    </Group>

                    {recentRepairs.length === 0 && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Δεν υπάρχουν επισκευές</Text>
                    )}

                    <Stack gap="xs">
                        {recentRepairs.map((repair) => (
                            <Group key={repair.id} justify="space-between" wrap="nowrap" p="sm">
                                <Group gap="sm" wrap="nowrap">
                                    <ThemeIcon size={36} radius="md" variant="light" color="yellow">
                                        <IconHammer size={18} />
                                    </ThemeIcon>
                                    <div>
                                        <Text fw={600} size="sm">{repair.description}</Text>
                                        <Text size="xs" c="dimmed">{new Date(repair.date).toLocaleDateString('el-GR')}</Text>
                                    </div>
                                </Group>
                                <Text fw={600} size="sm">{repair.cost}€</Text>
                            </Group>
                        ))}
                    </Stack>
                </Card>
            </SimpleGrid>
        </Stack>
    )
}
