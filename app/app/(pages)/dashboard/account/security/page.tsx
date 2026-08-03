'use client'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Button,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import {
    IconAlertTriangle,
    IconLock,
    IconPlayerPause,
    IconTrash,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { DeleteModal } from '@/app/components/layout/DeleteModal'
import { ChangePasswordSchema, type ChangePasswordFormValues } from '@/app/lib/utils/formSchemas'

function SectionTitle({ label, icon: Icon, color = 'blue' }: { label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color?: string }) {
    return (
        <Group gap={8} align="center" style={{ borderLeft: `3px solid var(--mantine-color-${color}-6)`, paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: `var(--mantine-color-${color}-6)` }} />
            <Text fw={600} size="xs" tt="uppercase" style={{ letterSpacing: '0.05em' }} c={color}>
                {label}
            </Text>
        </Group>
    )
}

export default function Security() {

    const [savingPassword, setSavingPassword] = useState(false)
    const [deleteOpened, setDeleteOpened] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(ChangePasswordSchema),
    })

    const formProps = { control, errors }

    const onChangePassword = async () => {
        setSavingPassword(true)

        setTimeout(() => {
            setSavingPassword(false)
            reset()
            notifications.show({
                color: 'green',
                title: 'Επιτυχία',
                message: 'Ο κωδικός σας άλλαξε με επιτυχία',
            })
        }, 600)
    }

    const handleDeleteAccount = async () => {
        setDeleting(true)

        setTimeout(() => {
            setDeleting(false)
            setDeleteOpened(false)
            notifications.show({
                color: 'red',
                title: 'Διαγραφή λογαριασμού',
                message: 'Η λειτουργία αυτή δεν είναι ακόμα διαθέσιμη',
            })
        }, 600)
    }

    return (
        <Stack gap="lg">

            <DeleteModal
                opened={deleteOpened}
                onClose={() => setDeleteOpened(false)}
                onConfirm={handleDeleteAccount}
                loading={deleting}
                title="Διαγραφή λογαριασμού"
                description="Είστε σίγουροι ότι θέλετε να διαγράψετε τον λογαριασμό σας; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί."
            />

            <Stack gap={6}>
                <Title order={2} fw={700}>Ασφάλεια</Title>
                <Text size="sm" c="dimmed">Διαχειριστείτε τον κωδικό πρόσβασης και τις ρυθμίσεις ασφαλείας του λογαριασμού σας.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Αλλαγή κωδικού" icon={IconLock} />

                    <ControlledTextfield
                        name="current_password"
                        {...formProps}
                        label="Τρέχων κωδικός"
                        type="password"
                        placeholder="••••••••"
                        leftSection={<IconLock size={14} />}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="new_password"
                            {...formProps}
                            label="Νέος κωδικός"
                            type="password"
                            placeholder="••••••••"
                            leftSection={<IconLock size={14} />}
                        />
                        <ControlledTextfield
                            name="confirm_password"
                            {...formProps}
                            label="Επιβεβαίωση κωδικού"
                            type="password"
                            placeholder="••••••••"
                            leftSection={<IconLock size={14} />}
                        />
                    </SimpleGrid>

                    <Group justify="flex-end">
                        <Button onClick={handleSubmit(onChangePassword)} loading={savingPassword}>
                            Ενημέρωση κωδικού
                        </Button>
                    </Group>
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg" style={{ borderColor: 'var(--mantine-color-red-6)' }}>
                <Stack gap="md">
                    <SectionTitle label="Ζώνη κινδύνου" icon={IconAlertTriangle} color="red" />

                    <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                        <Stack gap={2} style={{ flex: 1, minWidth: 220 }}>
                            <Text fw={500} size="sm">Παύση συνδρομής</Text>
                            <Text size="xs" c="dimmed">Παγώστε προσωρινά τον λογαριασμό σας. Μπορείτε να τον ενεργοποιήσετε ξανά οποιαδήποτε στιγμή.</Text>
                        </Stack>
                        <Button
                            variant="default"
                            color="red"
                            leftSection={<IconPlayerPause size={14} />}
                            onClick={() => notifications.show({
                                color: 'yellow',
                                title: 'Παύση συνδρομής',
                                message: 'Η λειτουργία αυτή δεν είναι ακόμα διαθέσιμη',
                            })}
                        >
                            Παύση
                        </Button>
                    </Group>

                    <Group justify="space-between" align="flex-start" wrap="wrap" gap="sm">
                        <Stack gap={2} style={{ flex: 1, minWidth: 220 }}>
                            <Text fw={500} size="sm">Διαγραφή λογαριασμού</Text>
                            <Text size="xs" c="dimmed">Διαγράψτε οριστικά τον λογαριασμό σας και όλα τα δεδομένα σας. Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.</Text>
                        </Stack>
                        <Button
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => setDeleteOpened(true)}
                        >
                            Διαγραφή
                        </Button>
                    </Group>
                </Stack>
            </Paper>

        </Stack>
    )
}
