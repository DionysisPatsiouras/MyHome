'use client'

import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Alert, Button, Group, Modal, SimpleGrid, Stack } from '@mantine/core'
import { IconAlertCircle, IconId, IconPhone, IconUser } from '@tabler/icons-react'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { EditTenantSchema, type EditTenantFormValues } from '@/app/lib/utils/formSchemas'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'

import type { Tenant } from '@/app/lib/types'

export function TenantEditModal({
    tenant, opened, onClose, onSaved,
}: { tenant: Tenant | null; opened: boolean; onClose: () => void; onSaved: () => void }) {

    const { PATCH } = useCRUD()

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditTenantFormValues>({
        resolver: zodResolver(EditTenantSchema),
    })

    useEffect(() => {
        if (!tenant) return

        setSubmitError(false)
        reset({
            first_name: tenant.first_name,
            last_name: tenant.last_name,
            afm: tenant.afm,
            phone: tenant.phone ?? '',
        })
    }, [tenant, reset])

    const formProps = { control, errors }

    const onSubmit = async (formData: EditTenantFormValues) => {
        if (!tenant) return

        setSubmitError(false)
        setSubmitting(true)

        try {
            await PATCH(Routes('tenants').patch(String(tenant.id)), formData, false, {
                success: { title: 'Επιτυχία', message: 'Ο ενοικιαστής ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση του ενοικιαστή' },
            })
            onSaved()
            onClose()
        } catch (err) {
            console.error(err)
            setSubmitError(true)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Στοιχεία ενοικιαστή" size="32rem">
            <Stack gap="md">
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

                <ControlledTextfield
                    name="afm"
                    {...formProps}
                    label="ΑΦΜ"
                    placeholder="π.χ. 123456789"
                    leftSection={<IconId size={14} />}
                />

                <ControlledTextfield
                    name="phone"
                    {...formProps}
                    label="Τηλέφωνο"
                    placeholder="π.χ. 6912345678"
                    leftSection={<IconPhone size={14} />}
                />

                {submitError && (
                    <Alert color="red" icon={<IconAlertCircle size={16} />} title="Κάτι πήγε στραβά">
                        Δεν ήταν δυνατή η ενημέρωση του ενοικιαστή. Δοκιμάστε ξανά.
                    </Alert>
                )}

                <Group justify="flex-end">
                    <Button variant="default" onClick={onClose}>
                        Άκυρο
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
                        Αποθήκευση
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
