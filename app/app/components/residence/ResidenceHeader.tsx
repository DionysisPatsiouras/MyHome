'use client'

import { Badge, Group, Paper, Skeleton, Stack, Text, Title } from '@mantine/core'
import { IconBolt, IconBuilding, IconCalendar, IconDoor, IconMapPin, IconRulerMeasure } from '@tabler/icons-react'

import { meters } from '@/app/lib/formatter'
import { useResidence } from '@/app/contexts/ResidenceContext'

export default function ResidenceHeader() {
    const { residence, loading } = useResidence()

    if (loading || !residence?.address) {
        return (
            <Paper bg="violet.0" radius="md" p="lg" mb="md">
                <Stack gap="xs">
                    <Skeleton height={28} width="22rem" radius="sm" />
                    <Skeleton height={18} width="14rem" radius="sm" />
                </Stack>
            </Paper>
        )
    }

    return (
        <Paper bg="violet.0" radius="md" p="lg" mb="md">
            <Group gap="sm" mb={4}>
                <Title order={1} size="h2" fw={700}>
                    {residence.address} {residence.road_number}
                </Title>
                {residence.residenceType && (
                    <Badge variant="light" color="violet">
                        {residence.residenceType.name}
                    </Badge>
                )}
                {residence.energy_class && (
                    <Badge variant="light" color="green">
                        Κλάση {residence.energy_class}
                    </Badge>
                )}
            </Group>
            <Group gap="lg" c="dimmed">
                {residence.zip_code && (
                    <Group gap={4}>
                        <IconMapPin size={16} />
                        <Text size="sm">{residence.zip_code}</Text>
                    </Group>
                )}
                {residence.square_meters && (
                    <Group gap={4}>
                        <IconRulerMeasure size={16} />
                        <Text size="sm">{meters(residence.square_meters)}</Text>
                    </Group>
                )}
                {residence.floor != null && (
                    <Group gap={4}>
                        <IconBuilding size={16} />
                        <Text size="sm">Όροφος {residence.floor}</Text>
                    </Group>
                )}
                {residence.flat_number && (
                    <Group gap={4}>
                        <IconDoor size={16} />
                        <Text size="sm">Διαμέρισμα {residence.flat_number}</Text>
                    </Group>
                )}
                {residence.construction_year && (
                    <Group gap={4}>
                        <IconCalendar size={16} />
                        <Text size="sm">
                            {residence.construction_year} ({new Date().getFullYear() - residence.construction_year} έτη)
                        </Text>
                    </Group>
                )}
                {residence.power_supply_number && (
                    <Group gap={4}>
                        <IconBolt size={16} />
                        <Text size="sm">{residence.power_supply_number}</Text>
                    </Group>
                )}
            </Group>
        </Paper>
    )
}
