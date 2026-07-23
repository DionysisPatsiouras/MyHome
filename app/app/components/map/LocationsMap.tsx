'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

const markerIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const DEFAULT_CENTER: [number, number] = [37.9838, 23.7275] // Athens

export interface MapLocation {
    id: string | number
    lat: number
    lng: number
    popup?: React.ReactNode
    icon?: L.Icon | L.DivIcon
}

export interface LocationsMapProps {
    locations: MapLocation[]
    height?: number | string
    width?: number | string
    zoom?: number
    fallbackCenter?: [number, number]
    emptyMessage?: string
    scrollWheelZoom?: boolean
}

function InvalidateSizeOnResize() {
    const map = useMap()

    useEffect(() => {
        const container = map.getContainer()
        const observer = new ResizeObserver(() => map.invalidateSize())
        observer.observe(container)

        return () => observer.disconnect()
    }, [map])

    return null
}

function FitToLocations({ points, zoom }: { points: [number, number][]; zoom: number }) {
    const map = useMap()

    useEffect(() => {
        if (points.length === 0) return

        if (points.length === 1) {
            map.setView(points[0], zoom)
            return
        }

        map.fitBounds(L.latLngBounds(points), { padding: [40, 40] })
    }, [map, points, zoom])

    return null
}

export default function LocationsMap({
    locations,
    height = 320,
    width = '100%',
    zoom = 15,
    fallbackCenter = DEFAULT_CENTER,
    emptyMessage = 'Δεν υπάρχουν τοποθεσίες',
    scrollWheelZoom = true,
}: LocationsMapProps) {
    const points: [number, number][] = locations.map((location) => [location.lat, location.lng])

    if (points.length === 0) {
        return (
            <div
                style={{
                    height,
                    width,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f9fafb',
                    color: '#9ca3af',
                    borderRadius: 8,
                }}
            >
                {emptyMessage}
            </div>
        )
    }

    return (
        <MapContainer
            center={points[0] ?? fallbackCenter}
            zoom={zoom}
            scrollWheelZoom={scrollWheelZoom}
            style={{ height, width }}
        >
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />

            <InvalidateSizeOnResize />

            <FitToLocations points={points} zoom={zoom} />

            {locations.map((location) => (
                <Marker key={location.id} position={[location.lat, location.lng]} icon={location.icon ?? markerIcon}>
                    {location.popup && <Popup>{location.popup}</Popup>}
                </Marker>
            ))}
        </MapContainer>
    )
}
