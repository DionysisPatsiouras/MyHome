'use client'

import { useState } from 'react'
import { Anchor, Center, Group, Loader, Paper, Stack, Text } from '@mantine/core'
import { IconAlertTriangle, IconCalendarCheck, IconCalendarClock, IconCoin } from '@tabler/icons-react'

import { COLORS } from '@/app/components/maintenances/Maintenances'
import { MaintenanceHistoryTable } from '@/app/components/maintenances/MaintenanceHistoryTable'
import { MaintenanceHistoryModal } from '@/app/components/maintenances/MaintenanceHistoryModal'
import type { MaintenanceHistoryEntry, MaintenanceOverview } from '@/app/lib/types'

const INLINE_HISTORY_LIMIT = 3

type MaintenanceOverviewPanelProps = {
    overview?: MaintenanceOverview
    loading: boolean
    onEditHistory: (entry: MaintenanceHistoryEntry) => void
    onDeleteHistory: (entry: MaintenanceHistoryEntry) => void
}

export function MaintenanceOverviewPanel({ overview, loading, onEditHistory, onDeleteHistory }: MaintenanceOverviewPanelProps) {
    const [showAllHistory, setShowAllHistory] = useState(false)

    const sortedHistory = overview
        ? [...overview.maintenance_history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : []
    const hasMoreHistory = sortedHistory.length > INLINE_HISTORY_LIMIT

    return (
        <Stack gap="sm">
            {loading && (
                <Center py="md">
                    <Loader size="sm" />
                </Center>
            )}

            {overview && (
                <>
                    {(() => {
                        const isOverdue = !!overview.next_maintenance && new Date(overview.next_maintenance) < new Date()
                        return (
                            <Group gap="sm" wrap="wrap">
                                <Paper withBorder radius="md" p="xs" style={{ flex: '1 1 170px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ background: COLORS.iconBg, borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IconCalendarCheck size={14} style={{ color: COLORS.iconFg }} />
                                    </div>
                                    <Stack gap={0}>
                                        <Text size="xs" c="dimmed">Τελευταία συντήρηση</Text>
                                        <Text size="sm" fw={600}>
                                            {overview.last_maintenance ? new Date(overview.last_maintenance).toLocaleDateString('el-GR') : '-'}
                                        </Text>
                                    </Stack>
                                </Paper>

                                <Paper
                                    withBorder
                                    radius="md"
                                    p="xs"
                                    style={{
                                        flex: '1 1 170px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        borderColor: isOverdue ? '#ef4444' : undefined,
                                        background: isOverdue ? '#fef2f2' : undefined,
                                    }}
                                >
                                    <div style={{ background: isOverdue ? '#fee2e2' : COLORS.iconBg, borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {isOverdue
                                            ? <IconAlertTriangle size={14} style={{ color: '#ef4444' }} />
                                            : <IconCalendarClock size={14} style={{ color: COLORS.iconFg }} />}
                                    </div>
                                    <Stack gap={0}>
                                        <Text size="xs" c={isOverdue ? '#ef4444' : 'dimmed'}>
                                            {isOverdue ? 'Ληξιπρόθεσμη συντήρηση' : 'Επόμενη συντήρηση'}
                                        </Text>
                                        <Text size="sm" fw={600} c={isOverdue ? '#ef4444' : undefined}>
                                            {overview.next_maintenance ? new Date(overview.next_maintenance).toLocaleDateString('el-GR') : '-'}
                                        </Text>
                                    </Stack>
                                </Paper>

                                <Paper withBorder radius="md" p="xs" style={{ flex: '1 1 170px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ background: COLORS.iconBg, borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IconCoin size={14} style={{ color: COLORS.iconFg }} />
                                    </div>
                                    <Stack gap={0}>
                                        <Text size="xs" c="dimmed">Συνολικό κόστος</Text>
                                        <Text size="sm" fw={600}>{overview.total_cost}€</Text>
                                    </Stack>
                                </Paper>
                            </Group>
                        )
                    })()}

                    {sortedHistory.length === 0 ? (
                        <Text size="sm" c={COLORS.empty}>Δεν υπάρχει ιστορικό συντηρήσεων</Text>
                    ) : (
                        <>
                            <MaintenanceHistoryTable
                                entries={sortedHistory.slice(0, INLINE_HISTORY_LIMIT)}
                                onEditHistory={onEditHistory}
                                onDeleteHistory={onDeleteHistory}
                            />
                            {hasMoreHistory && (
                                <Group justify="flex-end">
                                    <Anchor component="button" type="button" size="sm" onClick={() => setShowAllHistory(true)}>
                                        Προβολή όλων ({sortedHistory.length})
                                    </Anchor>
                                </Group>
                            )}
                            <MaintenanceHistoryModal
                                opened={showAllHistory}
                                onClose={() => setShowAllHistory(false)}
                                title="Ιστορικό συντηρήσεων"
                                entries={sortedHistory}
                                onEditHistory={onEditHistory}
                                onDeleteHistory={onDeleteHistory}
                            />
                        </>
                    )}
                </>
            )}
        </Stack>
    )
}
