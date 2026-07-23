'use client'

import { Card } from '@mantine/core'

import { LocationsMap } from '@/app/components/map'
import { useResidence } from '@/app/contexts/ResidenceContext'

export default function ResidenceLocation() {
    const { residence } = useResidence()

    const lat = Number(residence?.latitude)
    const lng = Number(residence?.longitude)
    const hasLocation = !isNaN(lat) && !isNaN(lng)

    return (
        <Card style={{ overflow: 'hidden', padding: 0 }}>
            <LocationsMap
                height={320}
                zoom={15}
                locations={hasLocation ? [{ id: residence!.id, lat, lng }] : []}
                emptyMessage="Δεν έχουν οριστεί συντεταγμένες για το ακίνητο"
            />
        </Card>
    )
}
