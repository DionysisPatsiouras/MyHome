'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const propertyIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

export type POIType =
    | 'supermarket'
    | 'pharmacy'
    | 'school'
    | 'hospital'
    | 'restaurant'
    | 'bank'
    | 'atm'
    | 'bakery'
    | 'gym';

const POI_CONFIG: Record<POIType, { key: string; value: string; color: string; label: string }> = {
    supermarket: { key: 'shop', value: 'supermarket', color: '#22c55e', label: 'Supermarket' },
    pharmacy: { key: 'amenity', value: 'pharmacy', color: '#ef4444', label: 'Pharmacy' },
    school: { key: 'amenity', value: 'school', color: '#f59e0b', label: 'School' },
    hospital: { key: 'amenity', value: 'hospital', color: '#dc2626', label: 'Hospital' },
    restaurant: { key: 'amenity', value: 'restaurant', color: '#8b5cf6', label: 'Restaurant' },
    bank: { key: 'amenity', value: 'bank', color: '#3b82f6', label: 'Bank' },
    atm: { key: 'amenity', value: 'atm', color: '#0ea5e9', label: 'ATM' },
    bakery: { key: 'shop', value: 'bakery', color: '#d97706', label: 'Bakery' },
    gym: { key: 'leisure', value: 'fitness_centre', color: '#ec4899', label: 'Gym' },
};

function createPOIIcon(color: string) {
    return L.divIcon({
        className: '',
        html: `<div style="
            width:14px;height:14px;
            background:${color};
            border:2px solid #fff;
            border-radius:50%;
            box-shadow:0 1px 4px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
    });
}

interface POIPlace {
    id: number;
    lat: number;
    lon: number;
    name: string;
    type: POIType;
}

async function fetchPOIs(lat: number, lon: number, types: POIType[], radius: number): Promise<POIPlace[]> {
    const conditions = types
        .map(t => {
            const { key, value } = POI_CONFIG[t];
            return `node["${key}"="${value}"](around:${radius},${lat},${lon});`;
        })
        .join('\n  ');

    const query = `[out:json][timeout:15];\n(\n  ${conditions}\n);\nout body;`;
    const res = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error('Overpass request failed');
    const data = await res.json();

    return (data.elements as any[])
        .filter(el => el.lat && el.lon)
        .map(el => {
            const matchedType =
                types.find(t => {
                    const { key, value } = POI_CONFIG[t];
                    return el.tags?.[key] === value;
                }) ?? types[0];
            return {
                id: el.id,
                lat: el.lat,
                lon: el.lon,
                name: el.tags?.name ?? POI_CONFIG[matchedType].label,
                type: matchedType,
            };
        });
}

export type MapComponentProps = {
    coordinates?: number[]
    zoom?: number
    height?: number | string
    width?: number | string
    pois?: POIType[]
    poiRadius?: number
}

export default function MapComponent({
    coordinates = [51.505, -0.09],
    zoom = 13,
    height = 310,
    width = '100%',
    pois,
    poiRadius = 1000,
}: MapComponentProps) {
    const [poiPlaces, setPoiPlaces] = useState<POIPlace[]>([]);
    const [lat, lon] = coordinates;
    const poisKey = pois?.join(',') ?? '';

    useEffect(() => {
        if (!pois?.length) return;
        setPoiPlaces([]);
        fetchPOIs(lat, lon, pois, poiRadius)
            .then(setPoiPlaces)
            .catch(console.error);
    }, [lat, lon, poisKey, poiRadius]);

    return (
        <MapContainer center={[lat, lon]} zoom={zoom} style={{ height, width }}>
            <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
            />

            <Marker position={[lat, lon]} icon={propertyIcon} />

            {poiPlaces.map(place => (
                <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    icon={createPOIIcon(POI_CONFIG[place.type].color)}
                >
                    <Popup>
                        <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                            <strong>{place.name}</strong>
                            <br />
                            <span style={{ color: POI_CONFIG[place.type].color, fontSize: 11, fontWeight: 600 }}>
                                {POI_CONFIG[place.type].label}
                            </span>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
