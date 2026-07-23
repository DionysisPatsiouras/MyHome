'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Badge, Button, Divider, Group, Paper, Skeleton, Stack, Text, Title } from '@mantine/core'
import {
    IconArrowLeft,
    IconBolt,
    IconBuildingSkyscraper,
    IconCalendar,
    IconDoor,
    IconMapPin,
    IconPencil,
    IconRulerMeasure,
    IconTool,
} from '@tabler/icons-react'
import type { IconProps } from '@tabler/icons-react'

import { meters } from '@/app/lib/utils/formatter'
import { useResidence } from '@/app/contexts/ResidenceContext'

const ENERGY_CLASS_COLOR: Record<string, string> = {
    'A+': 'teal',
    A: 'green',
    B: 'lime',
    C: 'yellow',
    D: 'orange',
    E: 'orange',
    F: 'red',
    G: 'red',
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<IconProps>; label: string; value: React.ReactNode }) {
    if (value == null || value === '') return null
    return (
        <Group gap={8} wrap="nowrap" align="flex-start">
            <Icon size={16} style={{ opacity: 0.6, marginTop: 2, flexShrink: 0 }} />
            <Stack gap={0}>
                <Text size="xs" c="dimmed" lh={1.2}>
                    {label}
                </Text>
                <Text size="sm" fw={500} lh={1.3}>
                    {value}
                </Text>
            </Stack>
        </Group>
    )
}

export default function ResidenceHeader() {
    const { residence, loading, maintenances } = useResidence()
    const pathname = usePathname()
    const isEditPage = pathname?.endsWith('/edit')

    if (loading || !residence?.address) {
        return (
            <Paper withBorder radius="md" p="lg" mb="md">
                <Stack gap="xs">
                    <Skeleton height={28} width="22rem" radius="sm" />
                    <Skeleton height={18} width="14rem" radius="sm" />
                </Stack>
            </Paper>
        )
    }

    const constructionAge = residence.construction_year ? new Date().getFullYear() - residence.construction_year : null
    const maintenanceCount = maintenances.filter(m => m.residence === residence.id).length

    return (
        <Paper withBorder radius="md" p="lg" mb="md">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={6}>
                    <Button
                        component={Link}
                        href="/dashboard/residences"
                        variant="subtle"
                        color="gray"
                        size="compact-sm"
                        pl={0}
                        w="fit-content"
                        leftSection={<IconArrowLeft size={14} />}
                    >
                        Ακίνητα
                    </Button>

                    <Group gap="sm">
                        <Title order={1} size="h2" fw={700}>
                            {residence.address} {residence.road_number}
                        </Title>
                        {residence.residenceType && (
                            <Badge variant="light" color="violet">
                                {residence.residenceType.name}
                            </Badge>
                        )}
                        {residence.energy_class && (
                            <Badge variant="light" color={ENERGY_CLASS_COLOR[residence.energy_class] ?? 'green'}>
                                Κλάση {residence.energy_class}
                            </Badge>
                        )}
                        {maintenanceCount > 0 && (
                            <Badge variant="light" color="orange" leftSection={<IconTool size={12} />}>
                                {maintenanceCount} συντηρήσεις
                            </Badge>
                        )}
                    </Group>

                    {residence.zip_code && (
                        <Group gap={4} c="dimmed">
                            <IconMapPin size={14} />
                            <Text size="sm">ΤΚ {residence.zip_code}</Text>
                        </Group>
                    )}
                </Stack>

                {!isEditPage && (
                    <Button
                        component={Link}
                        href={`/dashboard/residences/${residence.id}/edit`}
                        variant="light"
                        leftSection={<IconPencil size={16} />}
                    >
                        Επεξεργασία
                    </Button>
                )}
            </Group>

            <Divider my="md" />

            <Group gap="xl">
                <Stat icon={IconRulerMeasure} label="Εμβαδόν" value={meters(residence.square_meters)} />
                <Stat icon={IconBuildingSkyscraper} label="Όροφος" value={residence.floor} />
                <Stat icon={IconDoor} label="Διαμέρισμα" value={residence.flat_number} />
                <Stat
                    icon={IconCalendar}
                    label="Έτος κατασκευής"
                    value={residence.construction_year ? `${residence.construction_year} (${constructionAge} έτη)` : null}
                />
                <Stat icon={IconBolt} label="Παροχή ρεύματος" value={residence.power_supply_number} />
            </Group>
        </Paper>
    )
}
