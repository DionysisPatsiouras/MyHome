'use client'

import { Card } from 'primereact/card'

const dummyRepairs = [
    {
        id: 1,
        description: 'Αντικατάσταση βρύσης κουζίνας',
        cost: 120,
        date: '2025-03-10',
    },
    {
        id: 2,
        description: 'Επισκευή ηλεκτρολογικού πίνακα',
        cost: 340,
        date: '2025-07-22',
    },
    {
        id: 3,
        description: 'Βάψιμο εσωτερικών χώρων',
        cost: 800,
        date: '2024-11-05',
    },
]

export default function Repairs() {
    return (
        <div className="flex flex-column gap-3">
            {dummyRepairs.map(repair => (
                <Card key={repair.id}>
                    <div className="flex justify-content-between align-items-start">
                        <div className="flex align-items-center gap-3">
                            <div style={{ background: '#fef3c7', borderRadius: '50%', width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="pi pi-hammer" style={{ color: '#f59e0b', fontSize: '1rem' }} />
                            </div>
                            <div className="flex flex-column gap-1">
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.description}</span>
                                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                    <i className="pi pi-calendar mr-1" />{repair.date}
                                </span>
                            </div>
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.cost}€</span>
                    </div>
                </Card>
            ))}
        </div>
    )
}
