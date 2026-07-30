'use client'

import { Badge, Card, Group, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
    IconAlertTriangle,
    IconClock,
    IconHome,
    IconUser,
} from '@tabler/icons-react'

import { RentalDetailsModal } from '@/app/components/rentals/RentalDetailsModal'

import type { Rental } from '@/app/lib/types'

export const ENDING_SOON_DAYS = 30

const COLORS = {
    muted: '#6b7280',
    startBg: '#f0fdf4',
    startFg: '#16a34a',
    endBg: '#fef2f2',
    endFg: '#dc2626',
    warning: '#f59e0b',
    arrow: '#d1d5db',
}

function dateDiff(dateStr: string): { past: boolean; years: number; months: number; days: number } {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(dateStr)
    target.setHours(0, 0, 0, 0)
    const past = target < today
    const [start, end] = past ? [target, today] : [today, target]
    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()
    if (days < 0) { months--; days += new Date(end.getFullYear(), end.getMonth(), 0).getDate() }
    if (months < 0) { years--; months += 12 }
    return { past, years, months, days }
}

function formatDiff({ years, months, days }: { years: number; months: number; days: number }): string {
    const parts = []
    if (years > 0) parts.push(`${years} έτ.`)
    if (months > 0) parts.push(`${months} μήν.`)
    if (days > 0 || parts.length === 0) parts.push(`${days} ημ.`)
    return parts.join(' ')
}

function renderResidence(residence: Rental['residence']) {
    return `${residence.address} ${residence.road_number ?? ''}`.trim()
}

function DateBadge({ date, variant }: { date: string; variant: 'start' | 'end' }) {
    const isStart = variant === 'start'
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: isStart ? COLORS.startBg : COLORS.endBg,
                color: isStart ? COLORS.startFg : COLORS.endFg,
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 500,
                lineHeight: 1,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: isStart ? COLORS.startFg : COLORS.endFg,
                    flexShrink: 0,
                }}
            />
            {new Date(date).toLocaleDateString('el-GR')}
        </span>
    )
}

function RemainingBadge({ endDate }: { endDate: string }) {
    const diff = dateDiff(endDate)
    if (diff.past) return null
    const totalDaysLeft = diff.years * 365 + diff.months * 30 + diff.days
    const urgent = totalDaysLeft <= ENDING_SOON_DAYS
    const Icon = urgent ? IconAlertTriangle : IconClock
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: urgent ? COLORS.warning : COLORS.muted, fontWeight: urgent ? 600 : 400 }}>
            <Icon size={14} />
            {formatDiff(diff)} απομένουν
        </div>
    )
}

export function RentalCard({ rental, showResidence = true }: { rental: Rental; showResidence?: boolean }) {
    const [opened, { open, close }] = useDisclosure(false)
    const today = new Date().toISOString().slice(0, 10)
    const active = !rental.end_date || rental.end_date >= today

    const body = (
        <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
                {showResidence && (
                    <Group gap={8} align="center" fw={600} fz="1rem">
                        <IconHome size={16} style={{ color: COLORS.muted }} />
                        {renderResidence(rental.residence)}
                    </Group>
                )}
                <Group
                    gap={showResidence ? 6 : 8}
                    align="center"
                    c={showResidence ? 'dimmed' : undefined}
                    fw={showResidence ? undefined : 600}
                    fz={showResidence ? '0.85rem' : '1rem'}
                >
                    <IconUser size={showResidence ? 14 : 16} style={showResidence ? undefined : { color: COLORS.muted }} />
                    {`${rental.tenant.first_name} ${rental.tenant.last_name}`}
                </Group>
                <Group gap={8} align="center" mt={4}>
                    <DateBadge date={rental.start_date} variant="start" />
                    {rental.end_date && (
                        <>
                            <span style={{ color: COLORS.arrow, fontSize: '0.75rem' }}>→</span>
                            <DateBadge date={rental.end_date} variant="end" />
                        </>
                    )}
                </Group>
            </Stack>
            <Stack gap={8} align="flex-end">
                <Badge color={active ? 'green' : 'gray'} variant="light">
                    {active ? 'Ενεργό' : 'Ολοκληρωμένο'}
                </Badge>
                <Text fw={600}>{`${rental.rent_amount} € / μήνα`}</Text>
                {rental.end_date && active && <RemainingBadge endDate={rental.end_date} />}
            </Stack>
        </Group>
    )

    return (
        <>
            <Card withBorder padding="md" radius="md" onClick={open} style={{ cursor: 'pointer' }}>
                {body}
            </Card>
            <RentalDetailsModal rental={rental} opened={opened} onClose={close} />
        </>
    )
}
