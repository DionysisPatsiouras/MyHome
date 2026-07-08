'use client'

import { useState } from 'react'
import { Card } from 'primereact/card'
import { Tag } from 'primereact/tag'
import { Dialog } from 'primereact/dialog'

const dummyContracts = [
    {
        id: 1,
        tenant: 'Νίκος Θεοδωρίδης',
        phone: '6912345678',
        email: 'nikos.theodor@email.com',
        start_date: '2025-07-01',
        end_date: '2026-09-30',
        monthly_rent: 720,
        deposit: 1440,
        status: 'Ενεργό',
        notes: 'Καλός ενοικιαστής, πάντα πληρώνει εγκαίρως.',
    },
    {
        id: 2,
        tenant: 'Ελένη Κωστοπούλου',
        phone: '6934567890',
        email: 'eleni.kosto@email.com',
        start_date: '2025-08-01',
        end_date: '2026-07-10',
        monthly_rent: 850,
        deposit: 1700,
        status: 'Ενεργό',
        notes: null,
    },
    {
        id: 3,
        tenant: 'Δημήτρης Σταμάτης',
        phone: '6956789012',
        email: 'dimitris.s@email.com',
        start_date: '2024-06-20',
        end_date: '2026-06-25',
        monthly_rent: 690,
        deposit: 1380,
        status: 'Ενεργό',
        notes: 'Έχει κατοικίδιο (σκύλος).',
    },
    {
        id: 4,
        tenant: 'Γιώργος Παπαδόπουλος',
        phone: '6978901234',
        email: 'giorgos.pap@email.com',
        start_date: '2024-03-01',
        end_date: '2026-03-15',
        monthly_rent: 650,
        deposit: 1300,
        status: 'Ληγμένο',
        notes: null,
    },
    {
        id: 5,
        tenant: 'Μαρία Αντωνίου',
        phone: '6990123456',
        email: 'maria.ant@email.com',
        start_date: '2021-06-01',
        end_date: '2022-05-31',
        monthly_rent: 580,
        deposit: 1160,
        status: 'Ληγμένο',
        notes: 'Συμβόλαιο δεν ανανεώθηκε μετά τη λήξη.',
    },
]

type Contract = typeof dummyContracts[0]

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
        <div className="flex justify-between align-items-center py-2" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{label}</span>
            <span style={{ fontWeight: 500 }}>{value}</span>
        </div>
    )
}

function SectionTitle({ label, icon }: { label: string; icon: string }) {
    return (
        <div className="flex align-items-center gap-2 mt-4 mb-1" style={{ borderLeft: '3px solid #6366f1', paddingLeft: '0.5rem' }}>
            <i className={`pi ${icon}`} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1' }}>
                {label}
            </span>
        </div>
    )
}

export default function Contracts() {
    const [selected, setSelected] = useState<Contract | null>(null)

    return (
        <>
            <div className="flex flex-column gap-3">
                {dummyContracts.map(contract => (
                    <Card key={contract.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(contract)}>
                        <div className="flex justify-content-between align-items-start">
                            <div className="flex flex-column gap-1">
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                                    <i className="pi pi-user mr-2" style={{ color: '#6b7280' }} />
                                    {contract.tenant}
                                </span>
                                <div className="flex align-items-center gap-2 mt-1">
                                    <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '0.375rem', padding: '0.15rem 0.5rem', fontSize: '0.78rem', fontWeight: 500 }}>
                                        <i className="pi pi-arrow-right mr-1" style={{ fontSize: '0.7rem' }} />
                                        {contract.start_date}
                                    </span>
                                    <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>→</span>
                                    <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: '0.375rem', padding: '0.15rem 0.5rem', fontSize: '0.78rem', fontWeight: 500 }}>
                                        <i className="pi pi-arrow-left mr-1" style={{ fontSize: '0.7rem' }} />
                                        {contract.end_date}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-column align-items-end gap-2">
                                <Tag
                                    value={contract.status}
                                    severity={contract.status === 'Ενεργό' ? 'success' : 'secondary'}
                                />
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                                    {contract.monthly_rent}€ / μήνα
                                </span>
                                {(() => {
                                    const diff = dateDiff(contract.end_date)
                                    if (diff.past) return null
                                    const totalDaysLeft = diff.years * 365 + diff.months * 30 + diff.days
                                    if (totalDaysLeft <= 60) return (
                                        <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>
                                            <i className="pi pi-exclamation-triangle mr-1" />
                                            {formatDiff(diff)} απομένουν
                                        </span>
                                    )
                                    return (
                                        <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                            <i className="pi pi-clock mr-1" />
                                            {formatDiff(diff)} απομένουν
                                        </span>
                                    )
                                })()}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog
                header={selected?.tenant}
                visible={!!selected}
                onHide={() => setSelected(null)}
                style={{ width: '26rem' }}
                modal
            >
                {selected && (
                    <div className="flex flex-column gap-2">
                        <SectionTitle label="Στοιχεία Ενοικιαστή" icon="pi-user" />
                        <InfoRow label="Τηλέφωνο" value={selected.phone} />
                        <InfoRow label="Email" value={selected.email} />

                        <SectionTitle label="Συμβόλαιο" icon="pi-file" />
                        <InfoRow label="Έναρξη" value={selected.start_date} />
                        <InfoRow label="Λήξη" value={selected.end_date} />
                        <InfoRow label="Μηνιαίο ενοίκιο" value={`${selected.monthly_rent}€`} />
                        <InfoRow label="Εγγύηση" value={`${selected.deposit}€`} />
                        <div className="flex justify-between align-items-center py-2" style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Κατάσταση</span>
                            <Tag
                                value={selected.status}
                                severity={selected.status === 'Ενεργό' ? 'success' : 'secondary'}
                            />
                        </div>

                        {selected.notes && (
                            <>
                                <SectionTitle label="Σημειώσεις" icon="pi-comment" />
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>{selected.notes}</p>
                            </>
                        )}
                    </div>
                )}
            </Dialog>
        </>
    )
}
