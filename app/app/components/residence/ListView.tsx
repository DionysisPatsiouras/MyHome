'use client'

import Link from 'next/link'

import { Badge, Button, Group, Table, Text } from '@mantine/core'
import { IconRulerMeasure, IconPencil } from '@tabler/icons-react'

import { meters } from '@/app/lib/utils/formatter'

import type { Residence } from '@/app/lib/types'

interface ListViewProps {
    residences: Residence[]
}

export default function ListView({ residences }: ListViewProps) {
    return (
        <Table.ScrollContainer minWidth={600}>
            <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Διεύθυνση</Table.Th>
                        <Table.Th>Τύπος</Table.Th>
                        <Table.Th>Τετραγωνικά</Table.Th>
                        <Table.Th />
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {residences.map((residence: Residence) => (
                        <Table.Tr key={residence.id}>
                            <Table.Td>
                                <Text fw={600}>{`${residence.address} ${residence?.road_number ?? ''}`}</Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge variant="light" color="violet">
                                    {residence.residenceType?.name}
                                </Badge>
                            </Table.Td>
                            <Table.Td>
                                <Group gap={4} c="dimmed">
                                    <IconRulerMeasure size={14} />
                                    <Text size="sm" c="dimmed">
                                        {meters(residence.square_meters)}
                                    </Text>
                                </Group>
                            </Table.Td>
                            <Table.Td>
                                <Group gap="xs" justify="flex-end">
                                    <Button component={Link} href={`/dashboard/residences/${residence.id}`} size="xs" variant="light">
                                        Άνοιγμα
                                    </Button>

                                    <Button
                                        component={Link}
                                        href={`/dashboard/residences/${residence.id}/edit`}
                                        size="xs"
                                        px="xs"
                                        variant="light"
                                        color="gray"
                                    >
                                        <IconPencil size={14} />
                                    </Button>

                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
