'use client'

import { useState } from 'react'

import { Button, Group, Modal, PasswordInput, Stack, Text } from '@mantine/core'
import { IconAlertTriangle, IconLock } from '@tabler/icons-react'

interface PasswordConfirmModalProps {
    opened: boolean
    onClose: () => void
    onConfirm: (password: string) => void | Promise<void>
    title?: string
    description?: string
    loading?: boolean
}

export function PasswordConfirmModal({
    opened,
    onClose,
    onConfirm,
    title = 'Επιβεβαίωση',
    description = 'Για λόγους ασφαλείας, εισάγετε τον κωδικό πρόσβασής σας για να συνεχίσετε. Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.',
    loading = false,
}: PasswordConfirmModalProps) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleClose = () => {
        setPassword('')
        setError('')
        onClose()
    }

    const handleConfirm = async () => {
        if (!password) return

        setError('')

        try {
            await onConfirm(password)
            setPassword('')
        } catch (err: any) {
            setError(err?.message_gr ?? 'Λανθασμένος κωδικός')
        }
    }

    return (
        <Modal opened={opened} onClose={handleClose} title={title} centered size="sm" zIndex={9999}>
            <Stack gap="md">
                <Group gap="xs" align="flex-start" wrap="nowrap">
                    <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <Text size="sm" c="dimmed">
                        {description}
                    </Text>
                </Group>

                <PasswordInput
                    value={password}
                    onChange={(e) => {
                        setPassword(e.currentTarget.value)
                        setError('')
                    }}
                    placeholder="••••••••"
                    leftSection={<IconLock size={14} />}
                    error={error}
                    disabled={loading}
                    data-autofocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleConfirm()
                    }}
                />

                <Group justify="flex-end" gap="sm">
                    <Button variant="default" onClick={handleClose} disabled={loading}>
                        Άκυρο
                    </Button>
                    <Button color="red" onClick={handleConfirm} loading={loading} disabled={!password}>
                        Διαγραφή
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
