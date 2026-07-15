'use client'

import Link from 'next/link'

import { Badge, Button, Group, Menu, Table, Text } from '@mantine/core'
import { IconRulerMeasure, IconChevronDown, IconPencil, IconTrash } from '@tabler/icons-react'

import { meters } from '@/app/lib/formatter'

import type { Residence } from '@/app/lib/types'

interface ListViewProps {
    residences: Residence[]
    onDelete: (residence: Residence) => void
}

export default function ListView({ residences, onDelete }: ListViewProps) {
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
                                    <Menu position="bottom-end" withinPortal zIndex={9999}>
                                        <Menu.Target>
                                            <Button size="xs" px="xs" variant="light">
                                                <IconChevronDown size={14} />
                                            </Button>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                component={Link}
                                                href={`/dashboard/residences/${residence.id}/edit`}
                                                leftSection={<IconPencil size={16} />}
                                            >
                                                Επεξεργασία
                                            </Menu.Item>
                                            <Menu.Item
                                                color="red"
                                                leftSection={<IconTrash size={16} />}
                                                onClick={() => onDelete(residence)}
                                            >
                                                Διαγραφή
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
