'use client'

import { useEffect, useState } from 'react'

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
import { IconMail, IconUser } from '@tabler/icons-react'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { AccountDetailsSchema, type AccountDetailsFormValues } from '@/app/lib/utils/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { customRoute } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import SectionTitle from '@/app/components/layout/SectionTitle'
import type { User } from '@/app/lib/types'

export default function Account() {


    const { PATCH } = useCRUD()

    const [saving, setSaving] = useState(false)

    const { data: user, loading: loadingUser } = useFetch(customRoute('users/me'))

    const { control, handleSubmit, reset, formState: { errors } } =
        useForm<AccountDetailsFormValues>({
            resolver: zodResolver(AccountDetailsSchema)
        })

    useEffect(() => {
        if (!user || Array.isArray(user)) return

        const fetchedUser = user as User

        reset({
            first_name: fetchedUser.first_name,
            last_name: fetchedUser.last_name,
            email: fetchedUser.email,
        })
    }, [user, reset])

    const formProps = { control, errors }

    const onSave = async (formData: AccountDetailsFormValues) => {
        setSaving(true)

        try {
            await PATCH(customRoute('users/me'), formData, false, {
                success: { title: 'Επιτυχία', message: 'Τα στοιχεία σας ενημερώθηκαν με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση των στοιχείων σας' },
            })
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    if (loadingUser) return <PageLoader />

    return (
        <Stack gap="lg">

            <Stack gap={6}>
                <Title order={2} fw={700}>Λογαριασμός</Title>
                <Text size="sm" c="dimmed">Διαχειριστείτε τα προσωπικά σας στοιχεία.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Προσωπικά στοιχεία" icon={IconUser} />

                    <ControlledTextfield
                        name="email"
                        {...formProps}
                        label="Email"
                        placeholder="you@example.com"
                        disabled
                        leftSection={<IconMail size={14} />}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="first_name"
                            {...formProps}
                            label="Όνομα"
                            placeholder="π.χ. Γιάννης"
                            leftSection={<IconUser size={14} />}
                        />
                        <ControlledTextfield
                            name="last_name"
                            {...formProps}
                            label="Επώνυμο"
                            placeholder="π.χ. Παπαδόπουλος"
                            leftSection={<IconUser size={14} />}
                        />
                    </SimpleGrid>



                    <Group justify="flex-end">
                        <Button onClick={handleSubmit(onSave)} loading={saving}>
                            Αποθήκευση
                        </Button>
                    </Group>
                </Stack>
            </Paper>

        </Stack>
    )
}
