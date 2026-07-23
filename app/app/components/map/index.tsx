'use client'

import dynamic from 'next/dynamic'

import type { LocationsMapProps } from '@/app/components/map/LocationsMap'
import type { LocationPickerProps } from '@/app/components/map/LocationPicker'

export type { MapLocation, LocationsMapProps } from '@/app/components/map/LocationsMap'
export type { LocationPickerProps } from '@/app/components/map/LocationPicker'

export const LocationsMap = dynamic<LocationsMapProps>(
    () => import('@/app/components/map/LocationsMap'),
    { ssr: false },
)

export const LocationPicker = dynamic<LocationPickerProps>(
    () => import('@/app/components/map/LocationPicker'),
    { ssr: false },
)
