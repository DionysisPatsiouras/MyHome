'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Alert,
    Button,
    Card,
    Divider,
    Group,
    NumberInput,
    Paper,
    Select,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import {
    IconAlertCircle,
    IconArrowLeft,
    IconBolt,
    IconBuildingEstate,
    IconCalendar,
    IconCheck,
    IconDoor,
    IconFlame,
    IconMapPin,
    IconRulerMeasure,
} from '@tabler/icons-react'

// import { ControlledTextfield } from '@/app/components/forms/ControlledTextfield'
import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { NewResidenceSchema, type NewResidenceFormValues } from '@/app/lib/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import type { ResidenceType } from '@/app/lib/types'

const ENERGY_CLASSES = ['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G']

const FLOOR_OPTIONS = [
    { value: '-2', label: 'Υπόγειο 2' },
    { value: '-1', label: 'Υπόγειο' },
    { value: '0', label: 'Ισόγειο' },
    { value: '1', label: '1ος' },
    { value: '2', label: '2ος' },
    { value: '3', label: '3ος' },
    { value: '4', label: '4ος' },
    { value: '5', label: '5ος' },
    { value: '6', label: '6ος' },
    { value: '7', label: '7ος' },
    { value: '8', label: '8ος' },
    { value: '9', label: '9ος' },
    { value: '10', label: '10ος' },
]

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

function ResidenceTypeCard({ type, selected, onSelect }: { type: ResidenceType; selected: boolean; onSelect: () => void }) {
    return (
        <Card
            withBorder
            radius="md"
            padding="md"
            onClick={onSelect}
            style={{
                cursor: 'pointer',
                borderColor: selected ? 'var(--mantine-color-blue-6)' : undefined,
                borderWidth: selected ? 2 : 1,
                backgroundColor: selected ? 'var(--mantine-color-blue-light)' : undefined,
                transition: 'border-color 100ms ease, background-color 100ms ease',
            }}
        >
            <Group justify="space-between" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                    <IconBuildingEstate size={18} style={{ color: selected ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-dimmed)', flexShrink: 0 }} />
                    <Text fw={500} size="sm">{type.name}</Text>
                </Group>
                {selected && <IconCheck size={16} style={{ color: 'var(--mantine-color-blue-6)', flexShrink: 0 }} />}
            </Group>
        </Card>
    )
}

export default function NewResidence() {
    const router = useRouter()
    const { POST } = useCRUD()

    const { data: residenceTypes, loading: loadingTypes } = useFetch(Routes('residences/types').list)

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<NewResidenceFormValues>({
        resolver: zodResolver(NewResidenceSchema),
    })

    const onSubmit = async (formData: NewResidenceFormValues) => {
        setSubmitError(false)
        setSubmitting(true)

        try {
            await POST(Routes('residences').add, formData)
            router.push('/dashboard/residences')
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
                    href="/dashboard/residences"
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    pl={0}
                    w="fit-content"
                    leftSection={<IconArrowLeft size={14} />}
                >
                    Ακίνητα
                </Button>
                <Title order={2} fw={700}>Νέο Ακίνητο</Title>
                <Text size="sm" c="dimmed">Συμπληρώστε τα στοιχεία για να προσθέσετε ένα νέο ακίνητο.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Τύπος Ακινήτου" icon={IconBuildingEstate} />

                    {loadingTypes ? (
                        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={54} radius="md" />)}
                        </SimpleGrid>
                    ) : (
                        <Controller
                            name="residenceType"
                            control={control}
                            render={({ field }) => (
                                <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                                    {residenceTypes.map((type: ResidenceType) => (
                                        <ResidenceTypeCard
                                            key={type.id}
                                            type={type}
                                            selected={field.value === type.id}
                                            onSelect={() => field.onChange(type.id)}
                                        />
                                    ))}
                                </SimpleGrid>
                            )}
                        />
                    )}
                    {errors.residenceType && (
                        <Text size="xs" c="red">{errors.residenceType.message}</Text>
                    )}
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Διεύθυνση" icon={IconMapPin} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="address"
                            {...formProps}
                            label="Διεύθυνση"
                            placeholder="π.χ. Ερμού"
                        />
                        <ControlledTextfield
                            name="road_number"
                            control={control}
                            errors={errors}
                            label="Αριθμός"
                            placeholder="π.χ. 12"
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
                        <ControlledTextfield
                            name="zip_code"
                            control={control}
                            errors={errors}
                            label="ΤΚ"
                        />
                        <Controller
                            name="floor"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Όροφος"
                                    data={FLOOR_OPTIONS}
                                    error={errors.floor?.message}
                                    value={field.value !== undefined ? String(field.value) : null}
                                    onChange={value => field.onChange(value === null ? undefined : Number(value))}
                                    clearable
                                />
                            )}
                        />
                        <ControlledTextfield
                            name="flat_number"
                            control={control}
                            errors={errors}
                            label="Διαμέρισμα"
                            leftSection={<IconDoor size={14} />}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Τεχνικά Χαρακτηριστικά" icon={IconRulerMeasure} />

                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
                        <Controller
                            name="square_meters"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Τετραγωνικά"
                                    min={0}
                                    suffix=" τ.μ."
                                    error={errors.square_meters?.message}
                                    value={field.value ?? ''}
                                    onChange={value => field.onChange(value === '' ? undefined : Number(value))}
                                />
                            )}
                        />
                        <Controller
                            name="construction_year"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Έτος κατασκευής"
                                    leftSection={<IconCalendar size={14} />}
                                    min={1800}
                                    max={new Date().getFullYear()}
                                    error={errors.construction_year?.message}
                                    value={field.value ?? ''}
                                    onChange={value => field.onChange(value === '' ? undefined : Number(value))}
                                />
                            )}
                        />
                        <Controller
                            name="energy_class"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Ενεργειακή κατάταξη"
                                    data={ENERGY_CLASSES}
                                    error={errors.energy_class?.message}
                                    value={field.value ?? null}
                                    onChange={value => field.onChange(value ?? undefined)}
                                    clearable
                                />
                            )}
                        />
                    </SimpleGrid>

                    <Divider label="Παροχές" labelPosition="left" />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="power_supply_number"
                            control={control}
                            errors={errors}
                            label="Αρ. Παροχής Ρεύματος"
                            leftSection={<IconBolt size={14} />}
                        />
                        <ControlledTextfield
                            name="gas_supply_number"
                            control={control}
                            errors={errors}
                            label="Αρ. Παροχής Αερίου"
                            leftSection={<IconFlame size={14} />}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>

            {submitError && (
                <Alert color="red" icon={<IconAlertCircle size={16} />} title="Κάτι πήγε στραβά">
                    Δεν ήταν δυνατή η καταχώρηση του ακινήτου. Δοκιμάστε ξανά.
                </Alert>
            )}

            <Group justify="flex-end">
                <Button component={Link} href="/dashboard/residences" variant="default">
                    Άκυρο
                </Button>
                <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
                    Καταχώρηση
                </Button>
            </Group>
        </Stack>
    )
}
