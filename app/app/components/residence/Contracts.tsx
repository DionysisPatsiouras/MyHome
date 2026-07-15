'use client'

import { useState } from 'react'
import { Badge, Card, Group, Modal, Stack } from '@mantine/core'
import {
    IconAlertTriangle,
    IconArrowLeft,
    IconArrowRight,
    IconClock,
    IconFile,
    IconMessageCircle,
    IconUser,
} from '@tabler/icons-react'
import type { IconProps } from '@tabler/icons-react'
import { dummyContracts, type Contract } from '@/app/lib/data/contracts'

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

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    if (!value) return null
    return (
        <Group justify="space-between" align="center" py={8} style={{ borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </Group>
    )
}

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<IconProps> }) {
    return (
        <Group gap={8} align="center" mt={16} mb={4} style={{ borderLeft: '3px solid #6366f1', paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: '#6366f1' }} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1' }}>
                {label}
            </span>
        </Group>
    )
}

export default function Contracts() {
    const [selected, setSelected] = useState<Contract | null>(null)

    return (
        <>
            <Stack gap="md">
                {dummyContracts.map(contract => (
                    <Card key={contract.id} withBorder padding="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => setSelected(contract)}>
                        <Group justify="space-between" align="flex-start">
                            <Stack gap={4}>
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                                    <IconUser size={16} style={{ color: '#6b7280', marginRight: 8, verticalAlign: 'middle' }} />
                                    {contract.tenant}
                                </span>
                                <Group gap={8} align="center" mt={4}>
                                    <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '0.375rem', padding: '0.15rem 0.5rem', fontSize: '0.78rem', fontWeight: 500 }}>
                                        <IconArrowRight size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        {contract.start_date}
                                    </span>
                                    <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>→</span>
                                    <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: '0.375rem', padding: '0.15rem 0.5rem', fontSize: '0.78rem', fontWeight: 500 }}>
                                        <IconArrowLeft size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                        {contract.end_date}
                                    </span>
                                </Group>
                            </Stack>
                            <Stack gap={8} align="flex-end">
                                <Badge color={contract.status === 'Ενεργό' ? 'green' : 'gray'}>
                                    {contract.status}
                                </Badge>
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {contract.monthly_rent}€ / μήνα
                                </span>
                                {(() => {
                                    const diff = dateDiff(contract.end_date)
                                    if (diff.past) return null
                                    const totalDaysLeft = diff.years * 365 + diff.months * 30 + diff.days
                                    if (totalDaysLeft <= 60) return (
                                        <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                                            <IconAlertTriangle size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                            {formatDiff(diff)} απομένουν
                                        </span>
                                    )
                                    return (
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            <IconClock size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                            {formatDiff(diff)} απομένουν
                                        </span>
                                    )
                                })()}
                            </Stack>
                        </Group>
                    </Card>
                ))}
            </Stack>

            <Modal
                opened={!!selected}
                onClose={() => setSelected(null)}
                title={selected?.tenant}
                size="26rem"
            >
                {selected && (
                    <Stack gap={8}>
                        <SectionTitle label="Στοιχεία Ενοικιαστή" icon={IconUser} />
                        <InfoRow label="Τηλέφωνο" value={selected.phone} />
                        <InfoRow label="Email" value={selected.email} />

                        <SectionTitle label="Συμβόλαιο" icon={IconFile} />
                        <InfoRow label="Έναρξη" value={selected.start_date} />
                        <InfoRow label="Λήξη" value={selected.end_date} />
                        <InfoRow label="Μηνιαίο ενοίκιο" value={`${selected.monthly_rent}€`} />
                        <InfoRow label="Εγγύηση" value={`${selected.deposit}€`} />
                        <Group justify="space-between" align="center" py={8} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Κατάσταση</span>
                            <Badge color={selected.status === 'Ενεργό' ? 'green' : 'gray'}>
                                {selected.status}
                            </Badge>
                        </Group>

                        {selected.notes && (
                            <>
                                <SectionTitle label="Σημειώσεις" icon={IconMessageCircle} />
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{selected.notes}</p>
                            </>
                        )}
                    </Stack>
                )}
            </Modal>
        </>
    )
}
