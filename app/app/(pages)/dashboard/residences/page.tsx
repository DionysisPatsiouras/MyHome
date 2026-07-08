'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Card } from 'primereact/card'
import { Button } from 'primereact/button'

import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"
import { meters } from '@/app/lib/formatter'

import type { Residence } from '@/app/lib/types'

export default function Residences() {

    const MapComponent = dynamic(() => import("@/app/components/MapComponent"), {
        ssr: false,
        // loading: () => <div style={{ height: '400px' }} className="bg-gray-100 animate-pulse" />,
    });


    const { data } = useFetch(Routes('residences').list)
    console.log("🚀 ~ Residences ~ data:", data)

    return (
        <section className='flex align-items-center flex-column'>

            <div className='grid col-12 lg:col-10'>
                {data.map((residence: Residence) => (
                    <div
                        key={`${residence.id}-${residence.address}-${residence.square_meters}`}
                        className="col-12 lg:col-6"
                    >
                        <Card style={{ padding: 0, overflow: 'hidden' }}>

                            {/* Map — top */}
                            <div style={{ height: 220, width: '100%' }}>
                                <MapComponent
                                    height={220}
                                    width="100%"
                                    zoom={15}
                                    coordinates={[residence?.latitude, residence?.longitude]}
                                />
                            </div>

                            {/* Details — bottom */}
                            <div className='flex justify-between align-items-start' style={{ padding: '1rem 0rem 0rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                        {`${residence.address} ${residence?.road_number}`}
                                    </h2>
                                    <p style={{ fontWeight: 400, color: '#6b7280', marginBottom: '0.75rem' }}>
                                        {`${residence.residenceType.name} · ${meters(residence.square_meters)}`}
                                    </p>
                                    <Link href={`/dashboard/residences/${residence.id}`}>
                                        <Button label="Άνοιγμα" size="small" />
                                    </Link>
                                </div>
                                <i className='pi pi-cog cursor-pointer' style={{ fontSize: 20 }} />
                            </div>

                        </Card>
                    </div>
                ))}
            </div>

        </section>
    )
}