'use client'

import { Modal } from '@mantine/core'
import { MaintenanceHistoryTable } from '@/app/components/maintenances/MaintenanceHistoryTable'
import type { MaintenanceHistoryEntry } from '@/app/lib/types'

type MaintenanceHistoryModalProps = {
    opened: boolean
    onClose: () => void
    title: string
    entries: MaintenanceHistoryEntry[]
    onEditHistory: (entry: MaintenanceHistoryEntry) => void
    onDeleteHistory: (entry: MaintenanceHistoryEntry) => void
}

export function MaintenanceHistoryModal({ opened, onClose, title, entries, onEditHistory, onDeleteHistory }: MaintenanceHistoryModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} size="42rem">
            <MaintenanceHistoryTable entries={entries} onEditHistory={onEditHistory} onDeleteHistory={onDeleteHistory} />
        </Modal>
    )
}
