'use client'

import { useState } from 'react'
import { Accordion, Button, Group } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import { useResidence } from '@/app/contexts/ResidenceContext'
import { MaintenanceProvider } from '@/app/contexts/MaintenanceContext'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { NewMaintenanceModal } from '@/app/components/maintenances/NewMaintenanceModal'
import { DeleteModal } from '@/app/components/layout/DeleteModal'
import { MaintenanceAccordionItem } from '@/app/components/maintenances/MaintenanceAccordionItem'
import type { MaintenancePayload } from '@/app/lib/utils/formSchemas'
import type { Maintenance } from '@/app/lib/types'

export const COLORS = {
    iconBg: '#eef2ff',
    iconFg: '#6366f1',
    muted: '#6b7280',
    empty: '#9ca3af',
}

export default function Maintenances() {
    const { residence, maintenances, refetchMaintenances } = useResidence()
    const { POST, PATCH, DELETE } = useCRUD()

    const [creating, setCreating] = useState(false)
    const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const [deleteTarget, setDeleteTarget] = useState<Maintenance | null>(null)
    const [deleting, setDeleting] = useState(false)

    const [openMaintenance, setOpenMaintenance] = useState<string | null>(null)

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
            <Accordion
                variant="separated"
                radius="md"
                value={openMaintenance}
                onChange={setOpenMaintenance}
                styles={{ item: { backgroundColor: 'var(--mantine-color-body)', border: '1px solid var(--mantine-color-default-border)' } }}
            >
                {maintenances.map(m => (
                    <MaintenanceProvider key={m.id} maintenance={m}>
                        <MaintenanceAccordionItem
                            isOpen={openMaintenance === String(m.id)}
                            onEdit={setEditingMaintenance}
                            onDelete={setDeleteTarget}
                        />
                    </MaintenanceProvider>
                ))}
            </Accordion>
            {modals}
        </>
    )
}
