'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
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

export interface LocationPickerProps {
    latitude?: number
    longitude?: number
    onChange: (lat: number, lng: number) => void
    height?: number | string
    width?: number | string
    zoom?: number
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

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(event) {
            onChange(event.latlng.lat, event.latlng.lng)
        },
    })

    return null
}

export default function LocationPicker({
    latitude,
    longitude,
    onChange,
    height = 320,
    width = '100%',
    zoom = 15,
}: LocationPickerProps) {
    const hasLocation = latitude !== undefined && longitude !== undefined
    const center: [number, number] = hasLocation ? [latitude, longitude] : DEFAULT_CENTER

    return (
        <MapContainer center={center} zoom={hasLocation ? zoom : 6} scrollWheelZoom style={{ height, width }}>
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />

            <InvalidateSizeOnResize />

            <ClickHandler onChange={onChange} />

            {hasLocation && <Marker position={center} icon={markerIcon} />}
        </MapContainer>
    )
}
