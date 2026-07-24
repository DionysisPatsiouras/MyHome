'use client'

import { useState } from 'react'
import { ActionIcon, Button, Card, Group, Stack } from '@mantine/core'
import { IconCalendar, IconHammer, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'

import { useResidence } from '@/app/contexts/ResidenceContext'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { getCurrentUserId } from '@/app/lib/utils/auth'
import { NewRepairModal } from '@/app/components/layout/NewRepairModal'
import { DeleteModal } from '@/app/components/layout/DeleteModal'
import type { NewRepairFormValues } from '@/app/lib/utils/formSchemas'
import type { Repair } from '@/app/lib/types'

const COLORS = {
    iconBg: '#fef3c7',
    iconFg: '#f59e0b',
    muted: '#6b7280',
    empty: '#9ca3af',
}

export default function Repairs() {
    const { repairs, refetchRepairs } = useResidence()
    const { POST, PATCH, DELETE } = useCRUD()

    const [creating, setCreating] = useState(false)
    const [editingRepair, setEditingRepair] = useState<Repair | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [deleteTarget, setDeleteTarget] = useState<Repair | null>(null)
    const [deleting, setDeleting] = useState(false)

    const handleCreate = async (values: NewRepairFormValues) => {
        setSubmitting(true)
        try {
            await POST(Routes('repairs').add, { ...values, user: await getCurrentUserId() }, false, {
                success: { title: 'Επιτυχία', message: 'Η επισκευή καταχωρήθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η καταχώρηση της επισκευής' },
            })
            refetchRepairs()
        } finally {
            setSubmitting(false)
        }
    }

    const handleUpdate = async (values: NewRepairFormValues) => {
        if (!editingRepair) return
        setSubmitting(true)
        try {
            await PATCH(Routes('repairs').id(String(editingRepair.id)), values, false, {
                success: { title: 'Επιτυχία', message: 'Η επισκευή ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση της επισκευής' },
            })
            refetchRepairs()
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        try {
            await DELETE(Routes('repairs').delete(String(deleteTarget.id)))
            setDeleteTarget(null)
        } finally {
            setDeleting(false)
            refetchRepairs()
        }
    }

    const modalOpened = creating || !!editingRepair
    const closeModal = () => {
        setCreating(false)
        setEditingRepair(null)
    }

    const CreateButton = () => (
        <Group justify="flex-end" mb="md">
            <Button leftSection={<IconPlus size={16} />} onClick={() => setCreating(true)}>
                Νέα Επισκευή
            </Button>
        </Group>
    )

    const modals = (
        <>
            <NewRepairModal
                opened={modalOpened}
                onClose={closeModal}
                onSubmit={editingRepair ? handleUpdate : handleCreate}
                submitting={submitting}
                repair={editingRepair}
            />
            <DeleteModal
                opened={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Διαγραφή επισκευής"
                description={`Είστε σίγουροι ότι θέλετε να διαγράψετε την επισκευή "${deleteTarget?.description ?? ''}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
            />
        </>
    )

    if (repairs.length === 0) {
        return (
            <>
                <CreateButton />
                <div className="flex align-items-center justify-content-center" style={{ height: '8rem', color: COLORS.empty }}>
                    <span>Δεν υπάρχουν επισκευές</span>
                </div>
                {modals}
            </>
        )
    }

    return (
        <>
            <CreateButton />
            <Stack gap="md">
                {repairs.map(repair => (
                    <Card key={repair.id} withBorder padding="md" radius="md">
                        <Group justify="space-between" align="flex-start">
                            <Group align="center" gap={12}>
                                <div style={{ background: COLORS.iconBg, borderRadius: '50%', width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconHammer size={16} style={{ color: COLORS.iconFg }} />
                                </div>
                                <Stack gap={4}>
                                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.description}</span>
                                    <span style={{ color: COLORS.muted, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        <IconCalendar size={14} />
                                        {new Date(repair.date).toLocaleDateString('el-GR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                </Stack>
                            </Group>
                            <Group align="center" gap={12}>
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.cost}€</span>
                                <Group gap="xs">
                                    <ActionIcon variant="light" size="lg" radius="md" onClick={() => setEditingRepair(repair)}>
                                        <IconPencil size={18} />
                                    </ActionIcon>
                                    <ActionIcon variant="light" color="red" size="lg" radius="md" onClick={() => setDeleteTarget(repair)}>
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            </Group>
                        </Group>
                    </Card>
                ))}
            </Stack>
            {modals}
        </>
    )
}
