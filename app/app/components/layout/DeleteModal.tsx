'use client'

import { Button, Group, Modal, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'

interface DeleteModalProps {
    opened: boolean
    onClose: () => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    loading?: boolean
}

export function DeleteModal({
    opened,
    onClose,
    onConfirm,
    title = 'Διαγραφή',
    description = 'Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το στοιχείο; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.',
    loading = false,
}: DeleteModalProps) {
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered size="sm" zIndex={9999}>
            <Group gap="xs" align="flex-start" mb="lg" wrap="nowrap">
                <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" style={{ flexShrink: 0, marginTop: 2 }} />
                <Text size="sm" c="dimmed">
                    {description}
                </Text>
            </Group>
            <Group justify="flex-end" gap="sm">
                <Button variant="default" onClick={onClose} disabled={loading}>
                    Άκυρο
                </Button>
                <Button color="red" onClick={onConfirm} loading={loading}>
                    Διαγραφή
                </Button>
            </Group>
        </Modal>
    )
}
