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
import SectionTitle from '@/app/components/account/SectionTitle'
import { ChangePasswordSchema, type ChangePasswordFormValues } from '@/app/lib/utils/formSchemas'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { customRoute } from '@/app/lib/Routes'


export default function Security() {

    const { POST } = useCRUD()

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

    const onChangePassword = async (formData: ChangePasswordFormValues) => {
        setSavingPassword(true)

        try {
            await POST(customRoute('users/change-password'), formData)
                .then((res) => {
                    !res.success ?

                        notifications.show({
                            color: 'red',
                            title: 'Σφάλμα',
                            message: res?.message_gr ?? 'Δεν ήταν δυνατή η αλλαγή του κωδικού',
                        })

                        : (() => {
                            reset()
                            notifications.show({
                                color: 'green',
                                title: 'Επιτυχία',
                                message: 'Ο κωδικός σας άλλαξε με επιτυχία',
                            })
                        })()
                })


        } catch (err: any) {
            notifications.show({
                color: 'red',
                title: 'Σφάλμα',
                message: err?.message_gr ?? 'Δεν ήταν δυνατή η αλλαγή του κωδικού',
            })
        } finally {
            setSavingPassword(false)
        }
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
