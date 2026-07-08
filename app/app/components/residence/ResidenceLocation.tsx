'use client'

import dynamic from 'next/dynamic'
import { Card } from 'primereact/card'

import { useResidence } from '@/app/contexts/ResidenceContext'
import type { MapComponentProps } from '@/app/components/MapComponent'

const MapComponent = dynamic<MapComponentProps>(() => import('@/app/components/MapComponent'), {
    ssr: false,
})

export default function ResidenceLocation() {
    const { residence } = useResidence()

    const lat = residence?.latitude ? parseFloat(residence.latitude) : null
    const lon = residence?.longitude ? parseFloat(residence.longitude) : null
    const hasCoordinates = lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)

    return (
        <Card style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ height: 420, width: '100%', borderRadius: 8, overflow: 'hidden' }}>
                {hasCoordinates ? (
                    <MapComponent
                        height={420}
                        width="100%"
                        zoom={16}
                        coordinates={[lat!, lon!]}
                        pois={['supermarket', 'pharmacy', 'bakery']}
                        poiRadius={1000}
                    />
                ) : (
                    <div
                        className="flex align-items-center justify-content-center"
                        style={{ height: '100%', background: '#f9fafb', color: '#9ca3af' }}
                    >
                        <div className="text-center">
                            <i className="pi pi-map-marker" style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                            <p style={{ margin: 0 }}>Δεν υπάρχουν συντεταγμένες</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
