'use client'

import {
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
} from '@mantine/core'
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form'
import {
    IconBolt,
    IconBuildingEstate,
    IconCalendar,
    IconCheck,
    IconDoor,
    IconDroplet,
    IconFlame,
    IconMapPin,
    IconRulerMeasure,
} from '@tabler/icons-react'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import ControlledSelect from '@/app/components/forms/ControlledSelect'
import { LocationPicker } from '@/app/components/map'
import type { NewResidenceFormValues } from '@/app/lib/utils/formSchemas'
import type { City, Prefecture, ResidenceType } from '@/app/lib/types'
import { ENERGY_CLASSES, FLOOR_OPTIONS } from '@/app/lib/constants/ResidenceOptions'
import SectionTitle from '@/app/components/layout/SectionTitle'

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

interface ResidenceFormProps {
    control: Control<NewResidenceFormValues>
    errors: FieldErrors<NewResidenceFormValues>
    setValue: UseFormSetValue<NewResidenceFormValues>
    residenceTypes: ResidenceType[]
    loadingTypes: boolean
    prefectures: Prefecture[]
    loadingPrefectures: boolean
    cities: City[]
    loadingCities: boolean
    selectedPrefectureId: number | null
    setSelectedPrefectureId: (id: number | null) => void
}

export default function ResidenceForm({
    control,
    errors,
    setValue,
    residenceTypes,
    loadingTypes,
    prefectures,
    loadingPrefectures,
    cities,
    loadingCities,
    selectedPrefectureId,
    setSelectedPrefectureId,
}: ResidenceFormProps) {
    const formProps = { control, errors }

    const citiesForPrefecture = (cities ?? []).filter(
        (city: City) => selectedPrefectureId == null || city.prefecture?.id === selectedPrefectureId
    )

    return (
        <>
            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Τύπος Ακινήτου" icon={IconBuildingEstate} />

                    {loadingTypes ? (
                        <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={54} radius="md" />)}
                        </SimpleGrid>
                    ) : (
                        <Controller
                            name="residenceType_id"
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
                    {errors.residenceType_id && (
                        <Text size="xs" c="red">{errors.residenceType_id.message}</Text>
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
                            {...formProps}
                            label="Αριθμός"
                            placeholder="π.χ. 12"
                        />
                        <Select
                            label="Νομός"
                            placeholder="Επιλέξτε νομό"
                            data={(prefectures ?? []).map((prefecture: Prefecture) => ({ value: String(prefecture.id), label: prefecture.name }))}
                            disabled={loadingPrefectures}
                            value={selectedPrefectureId ? String(selectedPrefectureId) : null}
                            onChange={(value) => {
                                setSelectedPrefectureId(value ? Number(value) : null)
                                setValue('city_id', undefined as any)
                            }}
                            searchable
                            clearable
                        />
                        <ControlledSelect
                            name="city_id"
                            {...formProps}
                            label="Πόλη"
                            placeholder={selectedPrefectureId ? "Επιλέξτε πόλη" : "Επιλέξτε πρώτα νομό"}
                            data={citiesForPrefecture.map((city: City) => ({ value: String(city.id), label: city.name }))}
                            disabled={loadingCities || !selectedPrefectureId}
                            valueAsNumber
                            searchable
                            clearable
                        />
                        <ControlledTextfield
                            name="zip_code"
                            {...formProps}
                            label="ΤΚ"
                        />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledSelect
                            name="floor"
                            {...formProps}
                            label="Όροφος"
                            data={FLOOR_OPTIONS}
                            valueAsNumber
                            clearable
                        />
                        <ControlledTextfield
                            name="flat_number"
                            {...formProps}
                            label="Διαμέρισμα"
                            leftSection={<IconDoor size={14} />}
                        />
                    </SimpleGrid>

                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field: latField }) => (
                            <Controller
                                name="longitude"
                                control={control}
                                render={({ field: lonField }) => (
                                    <Stack gap={6}>
                                        <Text size="xs" c="dimmed">
                                            Κάντε κλικ στον χάρτη για να ορίσετε τη θέση του ακινήτου
                                            {latField.value && lonField.value
                                                ? ` — ${Number(latField.value).toFixed(5)}, ${Number(lonField.value).toFixed(5)}`
                                                : ''}
                                        </Text>
                                        <div style={{ borderRadius: 8, overflow: 'hidden' }}>
                                            <LocationPicker
                                                latitude={latField.value ? Number(latField.value) : undefined}
                                                longitude={lonField.value ? Number(lonField.value) : undefined}
                                                onChange={(lat, lng) => {
                                                    latField.onChange(lat.toFixed(6))
                                                    lonField.onChange(lng.toFixed(6))
                                                }}
                                            />
                                        </div>
                                    </Stack>
                                )}
                            />
                        )}
                    />
                </Stack>
            </Paper>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Τεχνικά Χαρακτηριστικά" icon={IconRulerMeasure} />

                    <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
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
                        <ControlledSelect
                            name="energy_class"
                            {...formProps}
                            label="Ενεργειακή κατάταξη"
                            data={ENERGY_CLASSES}
                            clearable
                        />
                    </SimpleGrid>

                    <Divider label="Παροχές" labelPosition="left" />

                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                        <ControlledTextfield
                            name="power_supply_number"
                            {...formProps}
                            label="Αρ. Παροχής Ρεύματος"
                            leftSection={<IconBolt size={14} />}
                        />
                        <ControlledTextfield
                            name="gas_supply_number"
                            {...formProps}
                            label="Αρ. Παροχής Αερίου"
                            leftSection={<IconFlame size={14} />}
                        />
                        <ControlledTextfield
                            name="water_supply_number"
                            {...formProps}
                            label="Αρ. Παροχής Νερού"
                            leftSection={<IconDroplet size={14} />}
                        />
                    </SimpleGrid>
                </Stack>
            </Paper>
        </>
    )
}
