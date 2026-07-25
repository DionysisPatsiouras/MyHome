'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Alert,
    Button,
    Group,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import {
    IconAlertCircle,
    IconArrowLeft,
    IconCalendar,
    IconCoin,
    IconFileText,
    IconHome,
    IconUser,
} from '@tabler/icons-react'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { NewRentalSchema, type NewRentalFormValues } from '@/app/lib/utils/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import type { Residence, Tenant } from '@/app/lib/types'

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }) {
    return (
        <Group gap={8} align="center" style={{ borderLeft: '3px solid var(--mantine-color-blue-6)', paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Text fw={600} size="xs" tt="uppercase" style={{ letterSpacing: '0.05em' }} c="blue">
                {label}
            </Text>
        </Group>
    )
}

export default function NewRental() {
    const router = useRouter()
    const { POST } = useCRUD()

    const { data: residences, loading: loadingResidences } = useFetch(Routes('residences').list)
    const { data: tenants, loading: loadingTenants } = useFetch(Routes('tenants').list)

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NewRentalFormValues>({
        resolver: zodResolver(NewRentalSchema),
    })

    const onSubmit = async (formData: NewRentalFormValues) => {
        setSubmitError(false)
        setSubmitting(true)

        try {
            await POST(Routes('rentals').add, formData, false, {
                success: { title: 'Επιτυχία', message: 'Το μισθωτήριο καταχωρήθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η καταχώρηση του μισθωτηρίου' },
            })
            router.push('/dashboard/rentals')
        } catch (err) {
            console.error(err)
            setSubmitError(true)
        } finally {
            setSubmitting(false)
        }
    }

    const formProps = { control, errors }

    return (
        <Stack gap="lg">
            <Stack gap={6}>
                <Button
                    component={Link}
                    href="/dashboard/rentals"
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    pl={0}
                    w="fit-content"
                    leftSection={<IconArrowLeft size={14} />}
                >
                    Μισθωτήρια
                </Button>
                <Title order={2} fw={700}>Νέο Μισθωτήριο</Title>
                <Text size="sm" c="dimmed">Συμπληρώστε τα στοιχεία για να προσθέσετε ένα νέο μισθωτήριο.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Ακίνητο & Ενοικιαστής" icon={IconHome} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <Controller
                            name="residence_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Ακίνητο"
                                    placeholder="Επιλέξτε ακίνητο"
                                    leftSection={<IconHome size={14} />}
                                    data={(residences ?? []).map((residence: Residence) => ({
                                        value: String(residence.id),
                                        label: `${residence.address} ${residence.road_number ?? ''}`.trim(),
                                    }))}
                                    disabled={loadingResidences}
                                    searchable
                                    nothingFoundMessage="Δεν βρέθηκαν ακίνητα"
                                    error={errors.residence_id?.message}
                                    value={field.value != null ? String(field.value) : null}
                                    onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                />
                            )}
                        />
                        <Controller
                            name="tenant_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Ενοικιαστής"
                                    placeholder="Επιλέξτε ενοικιαστή"
                                    leftSection={<IconUser size={14} />}
                                    data={(tenants ?? []).map((tenant: Tenant) => ({
                                        value: String(tenant.id),
                                        label: `${tenant.first_name} ${tenant.last_name}`,
                                    }))}
                                    disabled={loadingTenants}
                                    searchable
                                    nothingFoundMessage="Δεν βρέθηκαν ενοικιαστές"
                                    error={errors.tenant_id?.message}
                                    value={field.value != null ? String(field.value) : null}
                                    onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                                />
                            )}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Στοιχεία Μίσθωσης" icon={IconCalendar} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="start_date"
                            {...formProps}
                            type="date"
                            label="Έναρξη"
                        />
                        <ControlledTextfield
                            name="end_date"
                            {...formProps}
                            type="date"
                            label="Λήξη"
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <Controller
                            name="rent_amount"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Μηνιαίο ενοίκιο"
                                    leftSection={<IconCoin size={14} />}
                                    suffix=" €"
                                    min={0}
                                    error={errors.rent_amount?.message}
                                    value={field.value ?? ''}
                                    onChange={value => field.onChange(value === '' ? undefined : Number(value))}
                                />
                            )}
                        />
                        <ControlledTextfield
                            name="declaration_number"
                            {...formProps}
                            label="Αριθμός Δήλωσης"
                            placeholder="π.χ. 1234567890"
                            leftSection={<IconFileText size={14} />}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>

            {submitError && (
                <Alert color="red" icon={<IconAlertCircle size={16} />} title="Κάτι πήγε στραβά">
                    Δεν ήταν δυνατή η καταχώρηση του μισθωτηρίου. Δοκιμάστε ξανά.
                </Alert>
            )}

            <Group justify="flex-end">
                <Button component={Link} href="/dashboard/rentals" variant="default">
                    Άκυρο
                </Button>
                <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
                    Καταχώρηση
                </Button>
            </Group>
        </Stack>
    )
}
