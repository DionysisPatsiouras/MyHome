'use client'

import dynamic from 'next/dynamic'

import type { Residence } from '@/app/lib/types'

interface ResidencesMapProps {
    residences: Residence[]
    height?: number | string
}

const ResidencesMapView = dynamic<ResidencesMapProps>(
    () => import('@/app/components/residence/ResidencesMapView'),
    { ssr: false },
)

export function ResidencesMap(props: ResidencesMapProps) {
    return <ResidencesMapView {...props} />
}
