'use client'

import { useState } from 'react'
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
import { notifications } from '@mantine/notifications'

import ResidenceForm from '@/app/components/residence/ResidenceForm'
import { NewResidenceSchema, type NewResidenceFormValues } from '@/app/lib/utils/formSchemas'
import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes } from '@/app/lib/Routes'
import { getCurrentUserId } from '@/app/lib/utils/auth'

export default function NewResidence() {
    const router = useRouter()
    const { POST } = useCRUD()

    const { data: residenceTypes, loading: loadingTypes } = useFetch(Routes('residences/types').list)
    const { data: prefectures, loading: loadingPrefectures } = useFetch(Routes('residences/prefectures').list)
    const { data: cities, loading: loadingCities } = useFetch(Routes('residences/cities').list)

    const [submitError, setSubmitError] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [selectedPrefectureId, setSelectedPrefectureId] = useState<number | null>(null)

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<NewResidenceFormValues>({
        resolver: zodResolver(NewResidenceSchema),
    })

    const onSubmit = async (formData: NewResidenceFormValues) => {
        setSubmitError(false)
        setSubmitting(true)

        const submittedData = {
            ...formData,
            user: await getCurrentUserId()
        }

        try {
            await POST(Routes('residences').add, submittedData)
            notifications.show({
                color: 'green',
                title: 'Επιτυχία',
                message: 'Το ακίνητο καταχωρήθηκε με επιτυχία',
            })
            router.push('/dashboard/residences')
        } catch (err) {
            console.error(err)
            setSubmitError(true)
        } finally {
            setSubmitting(false)
        }
    }

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
