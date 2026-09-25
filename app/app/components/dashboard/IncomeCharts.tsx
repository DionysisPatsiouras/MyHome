import { Card, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'

import type { Rental, Residence } from '@/app/lib/types'

const formatCurrency = new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
})

type ResidenceRent = { key: string; label: string; amount: number }

function isActiveOn(rental: Rental, date: string) {
    return rental.start_date <= date && (!rental.end_date || rental.end_date >= date)
}

function getMonthlyRent(rental: Rental) {
    return Number(rental.rent_amount) || 0
}

function getIncomeByResidence(residences: Residence[], rentals: Rental[], today: string): ResidenceRent[] {
    const byResidence = new Map(residences.map((residence) => [
        residence.id,
        {
            key: residence.id,
            label: `${residence.address} ${residence.road_number}${residence.flat_number ? `, διαμ. ${residence.flat_number}` : ''}`,
            amount: 0,
        },
    ]))

    rentals.filter((rental) => isActiveOn(rental, today)).forEach((rental) => {
        const existing = byResidence.get(rental.residence.id)
        if (existing) existing.amount += getMonthlyRent(rental)
    })

    return [...byResidence.values()].sort((a, b) => b.amount - a.amount || a.label.localeCompare(b.label, 'el-GR'))
}

function ResidenceRentRows({ rows }: { rows: ResidenceRent[] }) {
    if (rows.length === 0) return <Text c="dimmed" size="sm" py="lg">Δεν υπάρχουν ακίνητα.</Text>

    return (
        <Stack gap={0}>
            {rows.map((row) => (
                <div
                    key={row.key}
                    style={{ borderTop: '1px solid var(--mantine-color-default-border)', padding: '16px 0' }}
                >
                    <Group justify="space-between" align="center" wrap="nowrap" gap="md">
                        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                            <ThemeIcon size={42} radius="md" color="blue" variant="light" style={{ flexShrink: 0 }}>
                                <IconHome size={21} stroke={1.7} />
                            </ThemeIcon>
                            <div style={{ minWidth: 0 }}>
                                <Text fw={600} style={{ overflowWrap: 'anywhere' }}>{row.label}</Text>
                                {row.amount === 0 && (
                                    <Text size="sm" c="dimmed">Χωρίς ενεργή μίσθωση</Text>
                                )}
                            </div>
                        </Group>
                        <Text fw={700} size="lg" c={row.amount === 0 ? 'dimmed' : undefined} style={{ whiteSpace: 'nowrap' }}>
                            {formatCurrency.format(row.amount)}
                        </Text>
                    </Group>
                </div>
            ))}
        </Stack>
    )
}

export function IncomeCharts({ residences, rentals, today }: {
    residences: Residence[]
    rentals: Rental[]
    today: string
}) {
    const incomeByResidence = getIncomeByResidence(residences, rentals, today)

    return (
        <Card withBorder radius="lg" padding="lg">
            <Title order={4}>Μισθώματα ανά ακίνητο</Title>
            <Text size="sm" c="dimmed" mb="lg">Μηνιαία ποσά από ενεργά μισθωτήρια</Text>
            <ResidenceRentRows rows={incomeByResidence} />
        </Card>
    )
}
