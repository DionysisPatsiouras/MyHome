'use client'

import { meters } from '@/app/lib/utils/formatter'
import { useResidence } from '@/app/contexts/ResidenceContext'

export default function ResidenceInfo() {
    const { residence } = useResidence()
    if (!residence) return null

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
            <div className="flex align-items-center gap-2 mt-4 mb-1" style={{ borderLeft: '3px solid #6366f1', paddingLeft: '0.3rem' }}>
                <i className={`pi ${icon}`} style={{ color: '#6366f1', fontSize: '0.85rem' }} />
                <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1' }}>
                    {label}
                </span>
            </div>
        )
    }

    return (
        <div>
            <SectionTitle label="Γενικα" icon="pi-home" />
            <InfoRow label="Διεύθυνση" value={`${residence.address} ${residence.road_number}`} />
            <InfoRow label="Τύπος" value={residence.residenceType?.name} />
            <InfoRow label="ΤΚ" value={residence.zip_code} />
            <InfoRow label="Όροφος" value={residence.floor} />
            <InfoRow label="Διαμέρισμα" value={residence.flat_number} />

            <SectionTitle label="Χαρακτηριστικα" icon="pi-th-large" />
            <InfoRow label="Τετραγωνικά" value={meters(residence.square_meters)} />
            <InfoRow
                label="Έτος κατασκευής"
                value={
                    residence.construction_year
                        ? `${residence.construction_year}  (${new Date().getFullYear() - residence.construction_year} έτη)`
                        : null
                }
            />
            <InfoRow label="Ενεργειακή κλάση" value={residence.energy_class} />

            <SectionTitle label="Ρευμα" icon="pi-bolt" />
            <InfoRow label="Αρ. Παροχής Ρεύματος" value={residence.power_supply_number} />
        </div>

    )
}