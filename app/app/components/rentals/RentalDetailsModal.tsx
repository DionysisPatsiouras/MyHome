'use client'

import Link from 'next/link'
import { Badge, Button, Divider, Group, Modal, Stack, Text } from '@mantine/core'
import { IconExternalLink, IconHome, IconPencil, IconUser } from '@tabler/icons-react'

import type { Rental } from '@/app/lib/types'

const MUTED = '#6b7280'

function renderResidence(residence: Rental['residence']) {
    return `${residence.address} ${residence.road_number ?? ''}`.trim()
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    if (!value && value !== 0) return null
    return (
        <Group justify="space-between" py={6} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <Text size="sm" c="dimmed">{label}</Text>
            <Text size="sm" fw={500}>{value}</Text>
        </Group>
    )
}

export function RentalDetailsModal({ rental, opened, onClose }: { rental: Rental; opened: boolean; onClose: () => void }) {
    const today = new Date().toISOString().slice(0, 10)
    const active = !rental.end_date || rental.end_date >= today

    return (
        <Modal opened={opened} onClose={onClose} title="Στοιχεία μισθωτηρίου" size="32rem">
            <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                    <Stack gap={4}>
                        <Group gap={8} align="center" fw={600} fz="1.05rem">
                            <IconHome size={16} style={{ color: MUTED }} />
                            {renderResidence(rental.residence)}
                        </Group>
                        <Group gap={8} align="center" c="dimmed" fz="0.9rem">
                            <IconUser size={14} />
                            {`${rental.tenant.first_name} ${rental.tenant.last_name}`}
                            {rental.tenant.is_deleted && (
                                <Badge color="red" variant="light" size="xs">
                                    Διαγραμμένος ενοικιαστής
                                </Badge>
                            )}
                        </Group>
                    </Stack>
                    <Badge color={active ? 'green' : 'gray'} variant="light">
                        {active ? 'Ενεργό' : 'Ολοκληρωμένο'}
                    </Badge>
                </Group>

                <Divider />

                <Stack gap={0}>
                    <InfoRow label="Ενοικιαστής" value={`${rental.tenant.first_name} ${rental.tenant.last_name}`} />
                    <InfoRow label="ΑΦΜ" value={rental.tenant.afm} />
                    <InfoRow label="Τηλέφωνο" value={rental.tenant.phone} />
                </Stack>

                <Stack gap={0}>
                    <InfoRow label="Έναρξη" value={new Date(rental.start_date).toLocaleDateString('el-GR')} />
                    <InfoRow label="Λήξη" value={rental.end_date ? new Date(rental.end_date).toLocaleDateString('el-GR') : 'Αόριστη'} />
                    <InfoRow label="Μηνιαίο ενοίκιο" value={`${rental.rent_amount} €`} />
                    <InfoRow label="Αριθμός Δήλωσης" value={rental.declaration_number} />
                </Stack>
                <Group grow>
                    <Button
                        component={Link}
                        href={`/dashboard/residences/${rental.residence.id}`}
                        variant="light"
                        rightSection={<IconExternalLink size={14} />}
                        onClick={onClose}
                    >
                        Προβολή ακινήτου
                    </Button>
                    <Button
                        component={Link}
                        href={`/dashboard/rentals/${rental.id}/edit`}
                        variant="light"
                        rightSection={<IconPencil size={14} />}
                        onClick={onClose}
                    >
                        Επεξεργασία
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
