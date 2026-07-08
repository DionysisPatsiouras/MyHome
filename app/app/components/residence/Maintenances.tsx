'use client'

import { Card } from 'primereact/card'

import { useResidence } from '@/app/contexts/ResidenceContext'

export default function Maintenances() {
    const { maintenances } = useResidence()

    if (maintenances.length === 0) {
        return (
            <div className="flex align-items-center justify-content-center" style={{ height: '8rem', color: '#9ca3af' }}>
                <span>Δεν υπάρχουν συντηρήσεις</span>
            </div>
        )
    }

    return (
        <div className="flex flex-column gap-3">
            {maintenances.map(m => (
                <Card key={m.id}>
                    <div className="flex align-items-center gap-3">
                        <i className="pi pi-wrench" style={{ color: '#6366f1', fontSize: '1.1rem' }} />
                        <div className="flex flex-column gap-1">
                            <span style={{ fontWeight: 600, fontSize: '1rem' }}>{m.title}</span>
                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                <i className="pi pi-refresh mr-1" />Κάθε {m.recurrence} ημέρες
                            </span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
