'use client'

import { useState } from 'react'
import { Accordion, ActionIcon, Button, Center, Flex, Group, Loader, Paper, Stack, Table, Text } from '@mantine/core'
import { IconAlertTriangle, IconCalendarCheck, IconCalendarClock, IconCoin, IconPencil, IconPlus, IconRefresh, IconTool, IconTrash } from '@tabler/icons-react'

import { useResidence } from '@/app/contexts/ResidenceContext'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { NewMaintenanceModal } from '@/app/components/layout/NewMaintenanceModal'
import { DeleteModal } from '@/app/components/layout/DeleteModal'
import type { MaintenancePayload } from '@/app/lib/utils/formSchemas'
import type { Maintenance, MaintenanceOverview } from '@/app/lib/types'

const COLORS = {
    iconBg: '#eef2ff',
    iconFg: '#6366f1',
    muted: '#6b7280',
    empty: '#9ca3af',
}

export default function Maintenances() {
    const { residence, maintenances, refetchMaintenances } = useResidence()
    const { GET, POST, PATCH, DELETE } = useCRUD()

    const [creating, setCreating] = useState(false)
    const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null)
    const [deleting, setDeleting] = useState(false)

    const [openMaintenance, setOpenMaintenance] = useState<string | null>(null)
    const [overviews, setOverviews] = useState<Record<string, MaintenanceOverview>>({})
    const [loadingOverview, setLoadingOverview] = useState<string | null>(null)

    const handleAccordionChange = async (value: string | null) => {
        setOpenMaintenance(value)
        if (!value || overviews[value]) return

        setLoadingOverview(value)
        try {
            const data: MaintenanceOverview = await GET(Routes('maintenances').overview(value))
            setOverviews(prev => ({ ...prev, [value]: data }))
        } finally {
            setLoadingOverview(null)
        }
    }

    const handleCreate = async (values: MaintenancePayload) => {
        setSubmitting(true)
        try {
            await POST(Routes('maintenances').add, { ...values, residence: residence?.id }, false, {
                success: { title: 'Επιτυχία', message: 'Η συντήρηση καταχωρήθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η καταχώρηση της συντήρησης' },
            })
            refetchMaintenances()
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (values: MaintenancePayload) => {
        if (!editingMaintenance) return
        setSubmitting(true)
        try {
            await PATCH(Routes('maintenances').id(String(editingMaintenance.id)), values, false, {
                success: { title: 'Επιτυχία', message: 'Η συντήρηση ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση της συντήρησης' },
            })
            refetchMaintenances()
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await DELETE(Routes('maintenances').delete(String(deleteTarget.id)))
            setDeleteTarget(null)
        } finally {
            setDeleting(false)
            refetchMaintenances()
        }
    }

    const modalOpened = creating || !!editingMaintenance
    const closeModal = () => {
        setCreating(false)
        setEditingMaintenance(null)
    }

    const CreateButton = () => (
        <Group justify="flex-end" mb="md">
            <Button leftSection={<IconPlus size={16} />} onClick={() => setCreating(true)}>
                Νέα Συντήρηση
            </Button>
        </Group>
    )

    const modals = (
        <>
            <NewMaintenanceModal
                opened={modalOpened}
                onClose={closeModal}
                onCreate={editingMaintenance ? handleUpdate : handleCreate}
                submitting={submitting}
                maintenance={editingMaintenance}
            />
            <DeleteModal
                opened={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Διαγραφή συντήρησης"
                description={`Είστε σίγουροι ότι θέλετε να διαγράψετε τη συντήρηση "${deleteTarget?.title ?? ''}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
            />
        </>
    )

    if (maintenances.length === 0) {
        return (
            <>
                <CreateButton />
                <div className="flex align-items-center justify-content-center" style={{ height: '8rem', color: COLORS.empty }}>
                    <span>Δεν υπάρχουν συντηρήσεις</span>
                </div>
                {modals}
            </>
        )
    }

    return (
        <>
            <CreateButton />
            <Accordion variant="separated" radius="md" value={openMaintenance} onChange={handleAccordionChange}>
                {maintenances.map(m => {
                    const overview = overviews[String(m.id)]
                    const isLoadingOverview = loadingOverview === String(m.id)

                    return (
                        <Accordion.Item key={m.id} value={String(m.id)}>
                            <Accordion.Control
                                icon={
                                    <div style={{ background: COLORS.iconBg, borderRadius: '50%', width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconTool size={16} style={{ color: COLORS.iconFg }} />
                                    </div>
                                }
                            >
                                <Flex direction={{ base: 'column', sm: 'row' }} justify="space-between" align={{ base: 'stretch', sm: 'center' }} gap="xs">
                                    <Stack gap={2} style={{ minWidth: 0 }}>
                                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{m.title}</span>
                                        <Group gap={4} align="center" style={{ color: COLORS.muted, fontSize: '0.8rem' }}>
                                            <IconRefresh size={12} />
                                            Κάθε {m.recurrence} ημέρες
                                        </Group>
                                    </Stack>
                                    <Group gap="xs" wrap="nowrap" justify="flex-end" mr="sm" onClick={event => event.stopPropagation()}>
                                        <ActionIcon
                                            component="div"
                                            role="button"
                                            tabIndex={0}
                                            variant="light"
                                            size="lg"
                                            radius="md"
                                            onClick={event => { event.stopPropagation(); setEditingMaintenance(m) }}
                                        >
                                            <IconPencil size={18} />
                                        </ActionIcon>
                                        <ActionIcon
                                            component="div"
                                            role="button"
                                            tabIndex={0}
                                            variant="light"
                                            color="red"
                                            size="lg"
                                            radius="md"
                                            onClick={event => { event.stopPropagation(); setDeleteTarget(m) }}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Group>
                                </Flex>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap="sm">

                                    {isLoadingOverview && (
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

                                            {overview.maintenance_history.length === 0 ? (
                                                <Text size="sm" c={COLORS.empty}>Δεν υπάρχει ιστορικό συντηρήσεων</Text>
                                            ) : (
                                                <Table.ScrollContainer minWidth={400}>
                                                    <Table verticalSpacing="xs">
                                                        <Table.Thead>
                                                            <Table.Tr>
                                                                <Table.Th>Ημερομηνία</Table.Th>
                                                                <Table.Th>Σχόλια</Table.Th>
                                                                <Table.Th>Κόστος</Table.Th>
                                                            </Table.Tr>
                                                        </Table.Thead>
                                                        <Table.Tbody>
                                                            {overview.maintenance_history.map(h => (
                                                                <Table.Tr key={h.id}>
                                                                    <Table.Td>{new Date(h.date).toLocaleDateString('el-GR')}</Table.Td>
                                                                    <Table.Td>{h.comments ?? '-'}</Table.Td>
                                                                    <Table.Td>{h.cost != null ? `${h.cost}€` : '-'}</Table.Td>
                                                                </Table.Tr>
                                                            ))}
                                                        </Table.Tbody>
                                                    </Table>
                                                </Table.ScrollContainer>
                                            )}
                                        </>
                                    )}
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>
            {modals}
        </>
    )
}
