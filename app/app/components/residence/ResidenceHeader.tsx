'use client'

import { Tag } from 'primereact/tag'
import { Skeleton } from 'primereact/skeleton'

import { meters } from '@/app/lib/formatter'
import { useResidence } from '@/app/contexts/ResidenceContext'

export default function ResidenceHeader() {
    const { residence, loading } = useResidence()

    if (loading || !residence?.address) {
        return (
            <div className="col-12 mb-2" style={{ background: '#f5f3ff', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
                <div className="flex flex-column gap-2">
                    <Skeleton width="22rem" height="2rem" />
                    <Skeleton width="14rem" height="1.2rem" />
                </div>
            </div>
        )
    }

    return (
        <div className="col-12 mb-2" style={{ background: '#f5f3ff', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
            <div className="flex align-items-center gap-3 mb-1">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                    {residence.address} {residence.road_number}
                </h1>
                {residence.residenceType && (
                    <Tag value={residence.residenceType.name} severity="info" />
                )}
                {residence.energy_class && (
                    <Tag value={`Κλάση ${residence.energy_class}`} severity="success" />
                )}
            </div>
            <div className="flex align-items-center gap-3" style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {residence.zip_code && <span><i className="pi pi-map-marker mr-1" />{residence.zip_code}</span>}
                {residence.square_meters && <span><i className="pi pi-th-large mr-1" />{meters(residence.square_meters)}</span>}
                {residence.floor != null && <span><i className="pi pi-building mr-1" />Όροφος {residence.floor}</span>}
            </div>
        </div>
    )
}
