'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { meters } from '@/app/lib/formatter'

import type { Residence } from '@/app/lib/types'

const propertyIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const ATHENS: [number, number] = [37.9838, 23.7275]

interface ResidencesMapViewProps {
    residences: Residence[]
    height?: number | string
}

function FitBounds({ points }: { points: [number, number][] }) {
    const map = useMap()

    useEffect(() => {
        if (points.length === 0) return

        if (points.length === 1) {
            map.setView(points[0], 15)
            return
        }

        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] })
    }, [map, points])

    return null
}

export default function ResidencesMapView({ residences, height = 520 }: ResidencesMapViewProps) {
    const located = residences
        .map((residence) => ({
            residence,
            lat: residence.latitude ? parseFloat(residence.latitude) : NaN,
            lon: residence.longitude ? parseFloat(residence.longitude) : NaN,
        }))
        .filter(({ lat, lon }) => !isNaN(lat) && !isNaN(lon))

    if (located.length === 0) {
        return (
            <div
                style={{
                    height,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f9fafb',
                    color: '#9ca3af',
                    borderRadius: 8,
                }}
            >
                Δεν υπάρχουν ακίνητα με συντεταγμένες
            </div>
        )
    }

    const points: [number, number][] = located.map(({ lat, lon }) => [lat, lon])

    return (
        <MapContainer center={points[0] ?? ATHENS} zoom={13} style={{ height, width: '100%' }}>
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />

            <FitBounds points={points} />

            {located.map(({ residence, lat, lon }) => (
                <Marker key={residence.id} position={[lat, lon]} icon={propertyIcon}>
                    <Popup>
                        <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                            <strong>{`${residence.address} ${residence.road_number ?? ''}`}</strong>
                            <br />
                            <span style={{ color: '#6d28d9', fontSize: 11, fontWeight: 600 }}>
                                {residence.residenceType?.name}
                            </span>
                            <br />
                            {meters(residence.square_meters)}
                            <br />
                            <Link href={`/dashboard/residences/${residence.id}`}>Άνοιγμα</Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
