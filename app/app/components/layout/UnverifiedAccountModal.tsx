'use client'

import { Button, Modal, Stack, Text, ThemeIcon } from '@mantine/core'
import { IconMailExclamation, IconSend } from '@tabler/icons-react'

interface UnverifiedAccountModalProps {
    opened: boolean
    onClose: () => void
    onResend: () => void | Promise<void>
    loading?: boolean
}

export function UnverifiedAccountModal({ opened, onClose, onResend, loading = false }: UnverifiedAccountModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            size="sm"
            radius="lg"
            padding="xl"
            withCloseButton
            overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
            <Stack align="center" gap="md">
                <ThemeIcon size={64} radius="xl" variant="light" color="orange">
                    <IconMailExclamation size={32} stroke={1.5} />
                </ThemeIcon>

                <Stack gap={4} align="center">
                    <Text fw={700} size="lg" ta="center">
                        Ο λογαριασμός δεν έχει επιβεβαιωθεί
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                        Παρακαλούμε ελέγξτε το email σας για τον σύνδεσμο επιβεβαίωσης.
                    </Text>
                </Stack>

                <Button
                    fullWidth
                    variant="light"
                    color="blue"
                    radius="md"
                    leftSection={<IconSend size={16} stroke={1.75} />}
                    onClick={onResend}
                    loading={loading}
                >
                    Επαναποστολή email επιβεβαίωσης
                </Button>
            </Stack>
        </Modal>
    )
}
