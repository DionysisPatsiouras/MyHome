// app/(pages)/dashboard/residences/MapComponent.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type Props = {
    coordinates?: any
    zoom?: number
    height?: number | string
    width?: number | string
}

export default function MapComponent({ coordinates = [51.505, -0.09], zoom = 13, height = 310, width = "100%" }: Props) {
    return (
        <MapContainer center={coordinates} zoom={zoom} style={{ height: height, width: width }}>
            {/* <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            /> */}
            {/* 
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            /> */}

            {/* <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            /> */}


            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />
            {/* 
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            /> */}

        </MapContainer>
    );
}