'use client'

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
    IconChevronRight,
    IconPlus,
    IconRefresh,
    IconRulerMeasure,
    IconTool,
    IconUsers,
} from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { meters } from '@/app/lib/utils/formatter'

import type { Maintenance, Residence } from '@/app/lib/types'

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
    const { data: technicians, loading: loadingTechnicians } = useFetch(Routes('technicians').list)
    const { data: maintenances, loading: loadingMaintenances } = useFetch(Routes('maintenances').list)

    if (loadingResidences || loadingTechnicians || loadingMaintenances) return <PageLoader />

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

    const totalSquareMeters = residences.reduce(
        (sum: number, r: Residence) => sum + (Number(r.square_meters) || 0),
        0,
    )

    const recentResidences = [...residences]
        .sort((a: Residence, b: Residence) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4)

    const residenceById = new Map(residences.map((r: Residence) => [r.id, r]))
    const upcomingMaintenances = maintenances.slice(0, 5)

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
                <StatCard icon={IconBuildingEstate} color="blue" value={residences.length} label="Ακίνητα" />
                <StatCard icon={IconUsers} color="violet" value={technicians.length} label="Τεχνικοί" />
                <StatCard icon={IconRulerMeasure} color="teal" value={meters(String(totalSquareMeters))} label="Συνολικά τ.μ." />
                <StatCard icon={IconRefresh} color="orange" value={maintenances.length} label="Συντηρήσεις" />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                <Card withBorder radius="lg" padding="lg">
                    <Group justify="space-between" mb="md">
                        <Title order={4}>Πρόσφατα ακίνητα</Title>
                        <Button component={Link} href="/dashboard/residences" variant="subtle" size="xs">
                            Όλα
                        </Button>
                    </Group>

                    {recentResidences.length === 0 && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Δεν υπάρχουν ακίνητα</Text>
                    )}

                    <Stack gap="xs">
                        {recentResidences.map((residence: Residence) => (
                            <UnstyledButton
                                key={residence.id}
                                component={Link}
                                href={`/dashboard/residences/${residence.id}`}
                                p="sm"
                                className="rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <Group justify="space-between" wrap="nowrap">
                                    <div>
                                        <Text fw={600} size="sm">
                                            {`${residence.address} ${residence.road_number ?? ''}`}
                                        </Text>
                                        <Group gap={6} mt={2}>
                                            <Badge variant="light" color="violet" size="xs">
                                                {residence.residenceType?.name}
                                            </Badge>
                                            <Text size="xs" c="dimmed">{meters(residence.square_meters)}</Text>
                                        </Group>
                                    </div>
                                    <IconChevronRight size={16} className="text-zinc-400 shrink-0" />
                                </Group>
                            </UnstyledButton>
                        ))}
                    </Stack>
                </Card>

                <Card withBorder radius="lg" padding="lg">
                    <Group mb="md">
                        <Title order={4}>Επερχόμενες συντηρήσεις</Title>
                    </Group>

                    {upcomingMaintenances.length === 0 && (
                        <Text c="dimmed" size="sm" ta="center" py="md">Δεν υπάρχουν προγραμματισμένες συντηρήσεις</Text>
                    )}

                    <Stack gap="xs">
                        {upcomingMaintenances.map((maintenance: Maintenance) => {
                            const residence = residenceById.get(maintenance.residence) as Residence | undefined
                            return (
                                <Group key={maintenance.id} justify="space-between" wrap="nowrap" p="sm">
                                    <Group gap="sm" wrap="nowrap">
                                        <ThemeIcon size={36} radius="md" variant="light" color="orange">
                                            <IconTool size={18} />
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={600} size="sm">{maintenance.title}</Text>
                                            <Text size="xs" c="dimmed">
                                                {residence ? `${residence.address} ${residence.road_number ?? ''}` : 'Άγνωστο ακίνητο'}
                                            </Text>
                                        </div>
                                    </Group>
                                    <Badge variant="light" color="gray" size="sm">
                                        Κάθε {maintenance.recurrence} ημέρες
                                    </Badge>
                                </Group>
                            )
                        })}
                    </Stack>
                </Card>
            </SimpleGrid>
        </Stack>
    )
}
