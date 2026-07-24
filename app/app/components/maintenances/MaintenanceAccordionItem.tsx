'use client'

import { useEffect, useState } from 'react'
import { Accordion, ActionIcon, Badge, Flex, Group, Stack, Tooltip } from '@mantine/core'
import { IconAlertTriangle, IconPencil, IconPlus, IconRefresh, IconTool, IconTrash } from '@tabler/icons-react'

import { useMaintenance } from '@/app/contexts/MaintenanceContext'
import { NewMaintenanceHistoryModal } from '@/app/components/maintenances/NewMaintenanceHistoryModal'
import { DeleteModal } from '@/app/components/layout/DeleteModal'
import { MaintenanceOverviewPanel } from '@/app/components/maintenances/MaintenanceOverviewPanel'
import { COLORS } from '@/app/components/maintenances/Maintenances'
import type { Maintenance, MaintenanceHistoryEntry } from '@/app/lib/types'
import type { NewMaintenanceHistoryFormValues } from '@/app/lib/utils/formSchemas'

const buttonsProps = {
    component: "div",
    role: "button",
    variant: "light",
    tabIndex: 0,
    size: "lg",
    radius: "md"
} as const

type MaintenanceAccordionItemProps = {
    onEdit: (maintenance: Maintenance) => void
    onDelete: (maintenance: Maintenance) => void
}

export function MaintenanceAccordionItem({ onEdit, onDelete }: MaintenanceAccordionItemProps) {
    const { maintenance, overview, loading, fetchOverview, logHistory, deleteHistory } = useMaintenance()

    const [fetched, setFetched] = useState(false)
    const [logging, setLogging] = useState(false)
    const [editingEntry, setEditingEntry] = useState<MaintenanceHistoryEntry | null>(null)
    const [loggingSubmitting, setLoggingSubmitting] = useState(false)

    const [deleteHistoryTarget, setDeleteHistoryTarget] = useState<MaintenanceHistoryEntry | null>(null)
    const [deletingHistory, setDeletingHistory] = useState(false)

    useEffect(() => {
        if (fetched) return
        setFetched(true)
        fetchOverview()
    }, [fetched, fetchOverview])

    const isOverdue = !!overview?.next_maintenance && new Date(overview.next_maintenance) < new Date()

    const handleLogHistory = async (values: NewMaintenanceHistoryFormValues) => {
        setLoggingSubmitting(true)
        try {
            await logHistory(values, editingEntry)
        } finally {
            setLoggingSubmitting(false)
        }
    }

    const handleDeleteHistory = async () => {
        if (!deleteHistoryTarget) return
        setDeletingHistory(true)
        try {
            await deleteHistory(deleteHistoryTarget)
            setDeleteHistoryTarget(null)
        } finally {
            setDeletingHistory(false)
        }
    }

    return (
        <Accordion.Item value={String(maintenance.id)}>
            <Accordion.Control
                icon={
                    <div style={{ background: COLORS.iconBg, borderRadius: '50%', width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconTool size={16} style={{ color: COLORS.iconFg }} />
                    </div>
                }
            >
                <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap="xs">
                    <Stack gap={2} style={{ minWidth: 0 }}>
                        <Group gap={6} align="center">
                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{maintenance.title}</span>
                            {isOverdue && (
                                <Badge
                                    variant="light"
                                    color="red"
                                    size="sm"
                                    radius="sm"
                                    leftSection={<IconAlertTriangle size={12} />}
                                >
                                    Ληξιπρoθεσμη
                                </Badge>
                            )}
                        </Group>
                        <Group gap={4} align="center" style={{ color: COLORS.muted, fontSize: '0.8rem' }}>
                            <IconRefresh size={12} />
                            Κάθε {maintenance.recurrence} ημέρες
                        </Group>
                    </Stack>
                    <Group gap="xs" wrap="nowrap" justify="flex-end" mr="sm" onClick={event => event.stopPropagation()}>
                        <Tooltip label="Καταγραφή εργασίας" withArrow>
                            <ActionIcon
                                {...buttonsProps}
                                onClick={event => { event.stopPropagation(); setLogging(true) }}
                            >
                                <IconPlus size={18} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Επεξεργασία" withArrow>
                            <ActionIcon
                                {...buttonsProps}
                                onClick={event => { event.stopPropagation(); onEdit(maintenance) }}
                            >
                                <IconPencil size={18} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Διαγραφή" withArrow>
                            <ActionIcon
                                {...buttonsProps}
                                color="red"
                                onClick={event => { event.stopPropagation(); onDelete(maintenance) }}
                            >
                                <IconTrash size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Flex>
            </Accordion.Control>
            <Accordion.Panel>
                <MaintenanceOverviewPanel
                    overview={overview ?? undefined}
                    loading={loading}
                    onEditHistory={setEditingEntry}
                    onDeleteHistory={setDeleteHistoryTarget}
                />
            </Accordion.Panel>

            <NewMaintenanceHistoryModal
                opened={logging || !!editingEntry}
                onClose={() => { setLogging(false); setEditingEntry(null) }}
                onSubmit={handleLogHistory}
                submitting={loggingSubmitting}
                entry={editingEntry}
            />
            <DeleteModal
                opened={!!deleteHistoryTarget}
                onClose={() => setDeleteHistoryTarget(null)}
                onConfirm={handleDeleteHistory}
                loading={deletingHistory}
                title="Διαγραφή συντήρησης"
                description="Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την καταχώρηση συντήρησης; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί."
            />
        </Accordion.Item>
    )
}
