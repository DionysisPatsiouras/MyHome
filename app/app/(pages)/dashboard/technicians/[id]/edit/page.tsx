'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Alert,
    Button,
    Group,
    Paper,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    Title,
} from '@mantine/core'
import {
    IconAlertCircle,
    IconArrowLeft,
    IconNotes,
    IconPhone,
    IconTools,
    IconUser,
} from '@tabler/icons-react'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { NewTechnicianSchema, type NewTechnicianFormValues } from '@/app/lib/utils/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes, customRoute } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import type { Technician, TechnicianType } from '@/app/lib/types'

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

export default function EditTechnician() {
    const router = useRouter()
    const { id } = useParams<{ id: string }>()
    const { PATCH } = useCRUD()

    const { data: technician, loading: loadingTechnician, dataNotFound } = useFetch(Routes('technicians').id(id))
    const { data: technicianTypes, loading: loadingTypes } = useFetch(customRoute('technicians/types'))

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewTechnicianFormValues>({
        resolver: zodResolver(NewTechnicianSchema),
    })

    useEffect(() => {
        if (!technician || Array.isArray(technician)) return

        const fetchedTechnician = technician as Technician

        reset({
            full_name: fetchedTechnician.full_name,
            technicianType_id: fetchedTechnician.technicianType?.id,
            phone_1: String(fetchedTechnician.phone_1 ?? ''),
            phone_2: fetchedTechnician.phone_2 ? String(fetchedTechnician.phone_2) : undefined,
            description: fetchedTechnician.description ?? '',
        })
    }, [technician, reset])

    const onSubmit = async (formData: NewTechnicianFormValues) => {
        setSubmitError(false)
        setSubmitting(true)

        try {
            await PATCH(Routes('technicians').id(id), formData, false, {
                success: { title: 'Επιτυχία', message: 'Ο τεχνικός ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση του τεχνικού' },
            })
            router.push('/dashboard/technicians')
        } catch (err) {
            console.error(err)
            setSubmitError(true)
        } finally {
            setSubmitting(false)
        }
    }

    const formProps = { control, errors }

    if (loadingTechnician) return <PageLoader />

    if (dataNotFound) {
        return (
            <DataNotFound
                title="Ο τεχνικός δεν βρέθηκε"
                description="Ο τεχνικός που αναζητάτε δεν υπάρχει ή έχει διαγραφεί."
                actionLabel="Πίσω στους τεχνικούς"
                actionHref="/dashboard/technicians"
            />
        )
    }

    return (
        <Stack gap="lg">
            <Stack gap={6}>
                <Button
                    component={Link}
                    href="/dashboard/technicians"
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    pl={0}
                    w="fit-content"
                    leftSection={<IconArrowLeft size={14} />}
                >
                    Τεχνικοί
                </Button>
                <Title order={2} fw={700}>Επεξεργασία Τεχνικού</Title>
                <Text size="sm" c="dimmed">Ενημερώστε τα στοιχεία του τεχνικού.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Ειδικότητα" icon={IconTools} />

                    <Controller
                        name="technicianType_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Επιλέξτε ειδικότητα"
                                leftSection={<IconTools size={14} />}
                                data={(technicianTypes ?? []).map((type: TechnicianType) => ({
                                    value: String(type.id),
                                    label: type.name,
                                }))}
                                disabled={loadingTypes}
                                searchable
                                nothingFoundMessage="Δεν βρέθηκαν ειδικότητες"
                                error={errors.technicianType_id?.message}
                                value={field.value != null ? String(field.value) : null}
                                onChange={(value) => field.onChange(value ? Number(value) : undefined)}
                            />
                        )}
                    />
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Στοιχεία" icon={IconUser} />

                    <ControlledTextfield
                        name="full_name"
                        {...formProps}
                        label="Ονοματεπώνυμο"
                        placeholder="π.χ. Γιάννης Παπαδόπουλος"
                        leftSection={<IconUser size={14} />}
                    />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="phone_1"
                            {...formProps}
                            label="Τηλέφωνο 1"
                            placeholder="π.χ. 6912345678"
                            leftSection={<IconPhone size={14} />}
                        />
                        <ControlledTextfield
                            name="phone_2"
                            {...formProps}
                            label="Τηλέφωνο 2"
                            placeholder="π.χ. 2101234567"
                            leftSection={<IconPhone size={14} />}
                        />
                    </SimpleGrid>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                label="Περιγραφή"
                                placeholder="Προαιρετικές σημειώσεις για τον τεχνικό.."
                                leftSection={<IconNotes size={14} />}
                                minRows={3}
                                autosize
                                error={errors.description?.message}
                                {...field}
                                value={field.value ?? ''}
                            />
                        )}
                    />
                </Stack>
            </Paper>

            {submitError && (
                <Alert color="red" icon={<IconAlertCircle size={16} />} title="Κάτι πήγε στραβά">
                    Δεν ήταν δυνατή η ενημέρωση του τεχνικού. Δοκιμάστε ξανά.
                </Alert>
            )}

            <Group justify="flex-end">
                <Button component={Link} href="/dashboard/technicians" variant="default">
                    Άκυρο
                </Button>
                <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
                    Αποθήκευση
                </Button>
            </Group>
        </Stack>
    )
}
