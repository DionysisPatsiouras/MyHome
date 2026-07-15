'use client'

import dynamic from 'next/dynamic'

import type { MapComponentProps } from '@/app/components/MapComponent'

const MapComponent = dynamic<MapComponentProps>(() => import('@/app/components/MapComponent'), {
    ssr: false,
})

export function ResidenceMap(props: MapComponentProps) {
    return <MapComponent {...props} />
}
