'use client'

import { Card } from '@mantine/core'

import { useResidence } from '@/app/contexts/ResidenceContext'
import { ResidenceMap } from '@/app/components/residence/ResidenceMap'

export default function ResidenceLocation() {

    const { residence } = useResidence()

    return (
        <Card style={{ overflow: 'hidden', padding: 0 }}>

            <ResidenceMap
                height={180}
                width="100%"
                zoom={15}
                coordinates={[Number(residence?.latitude), Number(residence?.longitude)]}
            />

        </Card>
    )
}
