'use client'

import { useState } from 'react'
import Link from 'next/link'

import { ActionIcon, Badge, Button, Group, Paper, Progress, Stack, Table, Text, Title } from '@mantine/core'
import { IconArrowRight, IconBuildingEstate, IconTrash } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes, customRoute } from '@/app/lib/Routes'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { PasswordConfirmModal } from '@/app/components/layout/PasswordConfirmModal'

import type { Residence } from '@/app/lib/types'


const PLAN_RESIDENCE_LIMIT = 3

export default function AccountResidences() {
    const { POST, DELETE } = useCRUD()
    const { data: residences, loading, fetchData } = useFetch(Routes('residences').list)

    const [deleteTarget, setDeleteTarget] = useState<Residence | null>(null)
    const [deleting, setDeleting] = useState(false)

    if (loading) return <PageLoader />

    const total = residences.length
    const usagePercent = Math.min(100, Math.round((total / PLAN_RESIDENCE_LIMIT) * 100))

    const handleDelete = async (password: string) => {
        if (!deleteTarget) return

        setDeleting(true)

        try {
            const verifyResult = await POST(customRoute('users/verify-password'), { password }, false, false)

            if (!verifyResult?.success) {
                throw verifyResult
            }

            await DELETE(Routes('residences').delete(String(deleteTarget.id)))
            setDeleteTarget(null)
            fetchData()
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Stack gap="lg">

            <PasswordConfirmModal
                opened={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Διαγραφή ακινήτου"
                description={`Εισάγετε τον κωδικό πρόσβασής σας για να διαγράψετε το ακίνητο "${deleteTarget?.address ?? ''} ${deleteTarget?.road_number ?? ''}". Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
            />


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

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <Text fw={600}>Τα ακίνητά μου</Text>

                    <Table.ScrollContainer minWidth={400}>
                        <Table verticalSpacing="sm" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Διεύθυνση</Table.Th>
                                    <Table.Th>Τύπος</Table.Th>
                                    <Table.Th w="10%" />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {residences.map((residence: Residence) => (
                                    <Table.Tr key={residence.id}>
                                        <Table.Td>
                                            <Text fw={600}>{`${residence.address} ${residence.road_number ?? ''}`}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="violet">
                                                {residence.residenceType?.name}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group justify="flex-end">
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    onClick={() => setDeleteTarget(residence)}
                                                >
                                                    <IconTrash size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>
            </Paper>

        </Stack>
    )
}
