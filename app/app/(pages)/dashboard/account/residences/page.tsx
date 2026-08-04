'use client'

import Link from 'next/link'

import { Button, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core'
import { IconArrowRight, IconBuildingEstate } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import SectionTitle from '@/app/components/account/SectionTitle'

const PLAN_RESIDENCE_LIMIT = 3

export default function AccountResidences() {
    const { data: residences, loading } = useFetch(Routes('residences').list)

    if (loading) return <PageLoader />

    const total = residences.length
    const usagePercent = Math.min(100, Math.round((total / PLAN_RESIDENCE_LIMIT) * 100))

    return (
        <Stack gap="lg">


            <Stack gap={6}>
                <Title order={2} fw={700}>Ακίνητα</Title>
                <Text size="sm" c="dimmed">Δείτε πόσα ακίνητα χρησιμοποιείτε σε σχέση με το πλάνο σας.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Group gap="sm">
                            <IconBuildingEstate size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                            <Text fw={600}>Χρήση ακινήτων</Text>
                        </Group>
                        <Text size="sm" c="dimmed">{total} / {PLAN_RESIDENCE_LIMIT}</Text>
                    </Group>

                    <Progress value={usagePercent} color={usagePercent >= 100 ? 'red' : 'blue'} radius="xl" />

                    <Text size="xs" c="dimmed">
                        {usagePercent >= 100
                            ? 'Έχετε φτάσει το όριο ακινήτων του πλάνου σας. Αναβαθμίστε για να προσθέσετε περισσότερα.'
                            : `Μπορείτε να προσθέσετε έως ${PLAN_RESIDENCE_LIMIT - total} ακόμα ακίνητα με το τρέχον πλάνο σας.`}
                    </Text>

                    <Group justify="flex-end">
                        <Button
                            component={Link}
                            href="/dashboard/residences"
                            variant="default"
                            rightSection={<IconArrowRight size={14} />}
                        >
                            Διαχείριση ακινήτων
                        </Button>
                    </Group>
                </Stack>
            </Paper>

        </Stack>
    )
}
