'use client'

import Link from 'next/link'

import { Badge, Card, Divider, Group, SimpleGrid, Stack, Text, Title, ActionIcon } from '@mantine/core'
import { IconPencil, IconPhone, IconTrash } from '@tabler/icons-react'

import type { Technician } from '@/app/lib/types'

interface CardViewProps {
    technicians: Technician[]
    onDelete: (technician: Technician) => void
}

export default function CardView({ technicians, onDelete }: CardViewProps) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="xl">
            {technicians.map((technician: Technician) => (
                <Card key={technician.id} padding="xl" radius="lg" withBorder>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <div>
                            <Title order={3} fw={700}>
                                {technician.full_name}
                            </Title>
                            {technician.technicianType && (
                                <Badge variant="light" color="violet" mt={6} size="md">
                                    {technician.technicianType.name}
                                </Badge>
                            )}
                        </div>
                        <Group gap="xs">
                            <ActionIcon
                                component={Link}
                                href={`/dashboard/technicians/${technician.id}/edit`}
                                variant="light"
                                size="lg"
                                radius="md"
                            >
                                <IconPencil size={18} />
                            </ActionIcon>
                            <ActionIcon
                                variant="light"
                                color="red"
                                size="lg"
                                radius="md"
                                onClick={() => onDelete(technician)}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Group>
                    </Group>

                    <Divider my="md" />

                    <Stack gap="sm">
                        <Group gap="sm" c="dimmed">
                            <IconPhone size={16} />
                            <Text size="sm">{technician.phone_1 || '-'}</Text>
                        </Group>
                        <Group gap="sm" c="dimmed">
                            <IconPhone size={16} />
                            <Text size="sm">{technician.phone_2 || '-'}</Text>
                        </Group>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    )
}
