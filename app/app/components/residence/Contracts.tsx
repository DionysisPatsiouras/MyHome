'use client'

import { useState } from 'react'
import { Badge, Button, Card, Group, Modal, Stack } from '@mantine/core'
import {
    IconAlertTriangle,
    IconArrowLeft,
    IconArrowRight,
    IconClock,
    IconFile,
    IconMessageCircle,
    IconPlus,
    IconUser,
} from '@tabler/icons-react'
import type { IconProps } from '@tabler/icons-react'
import { dummyContracts, type Contract } from '@/app/lib/data/contracts'
import type { NewContractFormValues } from '@/app/lib/formSchemas'
import { NewContractModal } from '@/app/components/layout/NewContractModal'

const COLORS = {
    muted: '#6b7280',
    border: '#f3f4f6',
    accent: '#6366f1',
    startBg: '#f0fdf4',
    startFg: '#16a34a',
    endBg: '#fef2f2',
    endFg: '#dc2626',
    warning: '#f59e0b',
    text: '#374151',
    arrow: '#d1d5db',
}

const STYLES = {
    primary: { fontWeight: 600, fontSize: '1rem', display: 'flex' } as const,
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

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
    if (!value) return null
    return (
        <Group justify="space-between" align="center" py={8} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <span style={{ color: COLORS.muted, fontSize: '0.875rem' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </Group>
    )
}

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<IconProps> }) {
    return (
        <Group gap={8} align="center" mt={16} mb={4} style={{ borderLeft: `3px solid ${COLORS.accent}`, paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: COLORS.accent }} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: COLORS.accent }}>
                {label}
            </span>
        </Group>
    )
}

function StatusBadge({ status }: { status: Contract['status'] }) {
    return <Badge color={status === 'Ενεργό' ? 'green' : 'gray'}>{status}</Badge>
}

function DateBadge({ date, variant }: { date: string; variant: 'start' | 'end' }) {
    const isStart = variant === 'start'
    const Icon = isStart ? IconArrowRight : IconArrowLeft
    return (
        <span
            style={{
                background: isStart ? COLORS.startBg : COLORS.endBg,
                color: isStart ? COLORS.startFg : COLORS.endFg,
                borderRadius: '0.375rem',
                padding: '0.15rem 0.5rem',
                fontSize: '0.78rem',
                fontWeight: 500,
            }}
        >
            <Icon size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {date}
        </span>
    )
}

function RemainingBadge({ endDate }: { endDate: string }) {
    const diff = dateDiff(endDate)
    if (diff.past) return null
    const totalDaysLeft = diff.years * 365 + diff.months * 30 + diff.days
    const urgent = totalDaysLeft <= 60
    const Icon = urgent ? IconAlertTriangle : IconClock
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: urgent ? COLORS.warning : COLORS.muted, fontWeight: urgent ? 600 : 400 }}>
            <Icon size={14} />
            {formatDiff(diff)} απομένουν
        </div>
    )
}

function ContractCard({ contract, onSelect }: { contract: Contract; onSelect: (contract: Contract) => void }) {
    return (
        <Card withBorder padding="md" radius="md" style={{ cursor: 'pointer' }} onClick={() => onSelect(contract)}>
            <Group justify="space-between" align="flex-start">
                <Stack gap={4}>
                    <div style={{ ...STYLES.primary, alignItems: 'center', gap: 8 }}>
                        <IconUser size={16} style={{ color: COLORS.muted }} />
                        {contract.tenant}
                    </div>
                    <Group gap={8} align="center" mt={4}>
                        <DateBadge date={contract.start_date} variant="start" />
                        <span style={{ color: COLORS.arrow, fontSize: '0.75rem' }}>→</span>
                        <DateBadge date={contract.end_date} variant="end" />
                    </Group>
                </Stack>
                <Stack gap={8} align="flex-end">
                    <StatusBadge status={contract.status} />
                    <span style={STYLES.primary}>{contract.monthly_rent}€ / μήνα</span>
                    <RemainingBadge endDate={contract.end_date} />
                </Stack>
            </Group>
        </Card>
    )
}

function ContractDetailsModal({ contract, onClose }: { contract: Contract | null; onClose: () => void }) {
    return (
        <Modal opened={!!contract} onClose={onClose} title={contract?.tenant} size="26rem">
            {contract && (
                <Stack gap={8}>
                    <SectionTitle label="Στοιχεία Ενοικιαστή" icon={IconUser} />
                    <InfoRow label="Τηλέφωνο" value={contract.phone} />
                    <InfoRow label="Email" value={contract.email} />

                    <SectionTitle label="Συμβόλαιο" icon={IconFile} />
                    <InfoRow label="Έναρξη" value={contract.start_date} />
                    <InfoRow label="Λήξη" value={contract.end_date} />
                    <InfoRow label="Μηνιαίο ενοίκιο" value={`${contract.monthly_rent}€`} />
                    <InfoRow label="Εγγύηση" value={`${contract.deposit}€`} />
                    <InfoRow label="Κατάσταση" value={<StatusBadge status={contract.status} />} />

                    {contract.notes && (
                        <>
                            <SectionTitle label="Σημειώσεις" icon={IconMessageCircle} />
                            <p style={{ margin: 0, fontSize: '0.875rem', color: COLORS.text }}>{contract.notes}</p>
                        </>
                    )}
                </Stack>
            )}
        </Modal>
    )
}

export default function Contracts() {
    const [contracts, setContracts] = useState<Contract[]>(dummyContracts)
    const [selected, setSelected] = useState<Contract | null>(null)
    const [creating, setCreating] = useState(false)

    const handleCreate = (values: NewContractFormValues) => {
        const id = Math.max(0, ...contracts.map(c => c.id)) + 1
        setContracts(prev => [{ id, ...values, notes: values.notes || null }, ...prev])
    }

    return (
        <>
            <Group justify="flex-end" mb="md">
                <Button leftSection={<IconPlus size={16} />} onClick={() => setCreating(true)}>
                    Νέο Συμβόλαιο
                </Button>
            </Group>

            <Stack gap="md">
                {contracts.map(contract => (
                    <ContractCard key={contract.id} contract={contract} onSelect={setSelected} />
                ))}
            </Stack>

            <ContractDetailsModal contract={selected} onClose={() => setSelected(null)} />
            <NewContractModal opened={creating} onClose={() => setCreating(false)} onCreate={handleCreate} />
        </>
    )
}
