'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Alert,
    Button,
    Group,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons-react'

import ResidenceForm from '@/app/components/residence/ResidenceForm'
import { NewResidenceSchema, type NewResidenceFormValues } from '@/app/lib/utils/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { useResidence } from '@/app/contexts/ResidenceContext'

export default function ResidenceEdit() {
    const router = useRouter()
    const { PATCH } = useCRUD()
    const { residence, loading, notFound, refetchResidence } = useResidence()

    const { data: residenceTypes, loading: loadingTypes } = useFetch(Routes('residences/types').list)
    const { data: prefectures, loading: loadingPrefectures } = useFetch(Routes('residences/prefectures').list)
    const { data: cities, loading: loadingCities } = useFetch(Routes('residences/cities').list)

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [selectedPrefectureId, setSelectedPrefectureId] = useState<number | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<NewResidenceFormValues>({
        resolver: zodResolver(NewResidenceSchema),
    })

    useEffect(() => {
        if (!residence) return

        setSelectedPrefectureId(residence.city?.prefecture?.id ?? null)
        reset({
            residenceType_id: residence.residenceType?.id,
            city_id: residence.city?.id,
            address: residence.address,
            road_number: residence.road_number,
            zip_code: residence.zip_code ?? undefined,
            floor: residence.floor ?? undefined,
            flat_number: residence.flat_number ?? undefined,
            latitude: residence.latitude ?? undefined,
            longitude: residence.longitude ?? undefined,
            square_meters: residence.square_meters ? Number(residence.square_meters) : undefined,
            construction_year: residence.construction_year ? residence.construction_year : undefined,
            energy_class: residence.energy_class ?? undefined,
            power_supply_number: residence.power_supply_number ?? undefined,
            gas_supply_number: residence.gas_supply_number ?? undefined,
            water_supply_number: residence.water_supply_number ?? undefined,
        })
    }, [residence, reset])

    const onSubmit = async (formData: NewResidenceFormValues) => {
        if (!residence) return

        setSubmitError(false)
        setSubmitting(true)

        try {
            await PATCH(Routes('residences').id(String(residence.id)), formData, false, {
                success: { title: 'Επιτυχία', message: 'Το ακίνητο ενημερώθηκε με επιτυχία' },
                error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η ενημέρωση του ακινήτου' },
            })
            refetchResidence()
            router.push(`/dashboard/residences/${residence.id}`)
        } catch (err) {
            console.error(err)
            setSubmitError(true)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <PageLoader />

    if (notFound || !residence) {
        return (
            <DataNotFound
                title="Το ακίνητο δεν βρέθηκε"
                description="Το ακίνητο που αναζητάτε δεν υπάρχει ή έχει διαγραφεί."
                actionLabel="Πίσω στα ακίνητα"
                actionHref="/dashboard/residences"
            />
        )
    }

    return (
        <Stack gap="lg">
            <Stack gap={6}>
                <Button
                    component={Link}
                    href={`/dashboard/residences/${residence.id}`}
                    variant="subtle"
                    color="gray"
                    size="compact-sm"
                    pl={0}
                    w="fit-content"
                    leftSection={<IconArrowLeft size={14} />}
                >
                    {residence.address} {residence.road_number}
                </Button>
                <Title order={2} fw={700}>Επεξεργασία Ακινήτου</Title>
                <Text size="sm" c="dimmed">Ενημερώστε τα στοιχεία του ακινήτου.</Text>
            </Stack>

            <ResidenceForm
                control={control}
                errors={errors}
                setValue={setValue}
                residenceTypes={residenceTypes ?? []}
                loadingTypes={loadingTypes}
                prefectures={prefectures ?? []}
                loadingPrefectures={loadingPrefectures}
                cities={cities ?? []}
                loadingCities={loadingCities}
                selectedPrefectureId={selectedPrefectureId}
                setSelectedPrefectureId={setSelectedPrefectureId}
            />

            {submitError && (
                <Alert color="red" icon={<IconAlertCircle size={16} />} title="Κάτι πήγε στραβά">
                    Δεν ήταν δυνατή η ενημέρωση του ακινήτου. Δοκιμάστε ξανά.
                </Alert>
            )}

            <Group justify="flex-end">
                <Button component={Link} href={`/dashboard/residences/${residence.id}`} variant="default">
                    Άκυρο
                </Button>
                <Button onClick={handleSubmit(onSubmit)} loading={submitting}>
                    Αποθήκευση
                </Button>
            </Group>
        </Stack>
    )
}
