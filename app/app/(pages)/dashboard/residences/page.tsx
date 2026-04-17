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

    const CardFooter = ({ id }: { id: number }) => (
        <div className='flex gap-3'>
            <Link href={`/dashboard/residences/${id}`}>
                <Button label="Άνοιγμα" icon="pi pi-eye" />
            </Link>
            <Button label="" icon="pi pi-trash" />
            {/* <Button label="Επεξεργασία" icon="pi pi-cog" severity="secondary" /> */}
        </div>
    )

    return (
        <section className='flex align-items-center flex-column '>




            {data.map((residence: Residence) => (
                <div
                    key={`${residence.id}-${residence.address}-${residence.square_meters}`}

                    className="card col-12 lg:col-7">
                    <Card>

                        <div className='flex flex-column md:flex-row md:gap-4'>
                            <div
                                className='col-12 md:col-3'
                                style={{
                                    //  border: "1px solid grey", 
                                    height: 300, minWidth: 350
                                }}
                            >

                                <MapComponent height={"-webkit-fill-available"} />

                            </div>

                            <div className='flex justify-between' style={{ width: "100%" }}>

                                <div className='flex flex-col justify-between'>

                                    <div>
                                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{`${residence.address} ${residence?.road_number}`} </h2>
                                        <p style={{ fontWeight: 400, color: "#6b7280" }}>{`${residence.residenceType.name} ${meters(residence.square_meters)}`}</p>
                                    </div>

                                    <Link href={`/dashboard/residences/${residence.id}`}>
                                        <Button label="Άνοιγμα" icon="pi pi-eye" />
                                    </Link>

                                </div>

                                <i className='pi pi-cog cursor-pointer' style={{ fontSize: 20 }} />
                            </div>
                        </div>

                    </Card>
                </div>
            ))}

        </section>
    )
}