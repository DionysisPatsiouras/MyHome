'use client'

import Link from 'next/link'

import { ActionIcon, Badge, Group, Stack, Table, Text } from '@mantine/core'
import { IconPencil, IconPhone, IconTrash } from '@tabler/icons-react'

import type { Technician } from '@/app/lib/types'

interface ListViewProps {
    technicians: Technician[]
    onDelete: (technician: Technician) => void
}

export default function ListView({ technicians, onDelete }: ListViewProps) {
    return (
        <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Όνομα</Table.Th>
                        <Table.Th>Τύπος</Table.Th>
                        <Table.Th>Τηλέφωνα</Table.Th>
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {technicians.map((technician: Technician) => (
                        <Table.Tr key={technician.id}>
                            <Table.Td>
                                <Text fw={600}>{technician.full_name}</Text>
                            </Table.Td>
                            <Table.Td>
                                {technician.technicianType && (
                                    <Badge variant="light" color="violet">
                                        {technician.technicianType.name}
                                    </Badge>
                                )}
                            </Table.Td>
                            <Table.Td>
                                <Stack gap={2} c="dimmed">
                                    <Group gap={4}>
                                        <IconPhone size={14} />
                                        <Text size="sm">{technician.phone_1 || '-'}</Text>
                                    </Group>
                                    <Group gap={4}>
                                        <IconPhone size={14} />
                                        <Text size="sm">{technician.phone_2 || '-'}</Text>
                                    </Group>
                                </Stack>
                            </Table.Td>
                            <Table.Td>
                                <Group justify="flex-end" gap="xs">
                                    <ActionIcon
                                        component={Link}
                                        href={`/dashboard/technicians/${technician.id}/edit`}
                                        variant="light"
                                    >
                                        <IconPencil size={16} />
                                    </ActionIcon>
                                    <ActionIcon
                                        variant="light"
                                        color="red"
                                        onClick={() => onDelete(technician)}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
