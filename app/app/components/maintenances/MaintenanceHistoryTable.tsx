'use client'

import { ActionIcon, Badge, Group, Paper, Table, Text } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'

import { COLORS } from '@/app/components/maintenances/Maintenances'
import type { MaintenanceHistoryEntry } from '@/app/lib/types'

type MaintenanceHistoryTableProps = {
    entries: MaintenanceHistoryEntry[]
    onEditHistory: (entry: MaintenanceHistoryEntry) => void
    onDeleteHistory: (entry: MaintenanceHistoryEntry) => void
}

export function MaintenanceHistoryTable({ entries, onEditHistory, onDeleteHistory }: MaintenanceHistoryTableProps) {
    return (
        <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
            <Table.ScrollContainer minWidth={400}>
                <Table verticalSpacing="sm" horizontalSpacing="md" striped highlightOnHover>
                    <Table.Thead style={{ background: COLORS.iconBg }}>
                        <Table.Tr>
                            <Table.Th style={{ fontSize: '0.7rem', letterSpacing: '0.03em', color: COLORS.iconFg }}>ΗΜΕΡΟΜΗΝΙΑ</Table.Th>
                            <Table.Th style={{ fontSize: '0.7rem', letterSpacing: '0.03em', color: COLORS.iconFg }}>ΣΧΟΛΙΑ</Table.Th>
                            <Table.Th style={{ fontSize: '0.7rem', letterSpacing: '0.03em', color: COLORS.iconFg, textAlign: 'right' }}>ΚΟΣΤΟΣ</Table.Th>
                            <Table.Th style={{ fontSize: '0.7rem', letterSpacing: '0.03em', color: COLORS.iconFg, textAlign: 'right' }}>ΕΝΕΡΓΕΙΕΣ</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {entries.map(h => (
                            <Table.Tr key={h.id}>
                                <Table.Td fw={500}>{new Date(h.date).toLocaleDateString('el-GR')}</Table.Td>
                                <Table.Td c={h.comments ? undefined : COLORS.empty}>{h.comments ?? '-'}</Table.Td>
                                <Table.Td style={{ textAlign: 'right' }}>
                                    {h.cost != null
                                        ? <Badge variant="light" radius="sm" color="indigo">{h.cost}€</Badge>
                                        : <Text size="sm" c={COLORS.empty}>-</Text>}
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={4} justify="flex-end" wrap="nowrap">
                                        <ActionIcon variant="light" size="md" radius="md" onClick={() => onEditHistory(h)}>
                                            <IconPencil size={16} />
                                        </ActionIcon>
                                        <ActionIcon variant="light" color="red" size="md" radius="md" onClick={() => onDeleteHistory(h)}>
                                            <IconTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Paper>
    )
}
