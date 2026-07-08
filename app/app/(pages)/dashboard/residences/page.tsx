'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'

import { Card, Button, Menu } from '@mantine/core'

import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"
import { meters } from '@/app/lib/formatter'

import type { Residence } from '@/app/lib/types'
import type { MapComponentProps } from '@/app/components/MapComponent'

export default function Residences() {

    const MapComponent = dynamic<MapComponentProps>(() => import("@/app/components/MapComponent"), {
        ssr: false,
    });


    const { data, fetchData } = useFetch(Routes('residences').list)
    console.log("🚀 ~ Residences ~ data:", data)

    const handleDelete = async (id: number) => {
        const token: any = await cookieStore.get("token")

        await fetch(Routes('residences').delete(String(id)), {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token?.value}`,
            },
        })

        fetchData()
    }

    return (
        <section className='flex align-items-center flex-column'>

            <div className='grid col-12 lg:col-10'>
                {data.map((residence: Residence) => (
                    <div
                        key={`${residence.id}-${residence.address}-${residence.square_meters}`}
                        className="col-12 lg:col-6"
                    >
                        <Card padding={0} radius="md" withBorder style={{ overflow: 'hidden' }}>

                            <div style={{ height: 220, width: '100%' }}>
                                <MapComponent
                                    height={220}
                                    width="100%"
                                    zoom={15}
                                    coordinates={[residence?.latitude, residence?.longitude]}
                                />
                            </div>

                            <div className='flex justify-between align-items-start' style={{ padding: '1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                        {`${residence.address} ${residence?.road_number}`}
                                    </h2>
                                    <p style={{ fontWeight: 400, color: '#6b7280', marginBottom: '0.75rem' }}>
                                        {`${residence.residenceType.name} · ${meters(residence.square_meters)}`}
                                    </p>
                                    <Button.Group>
                                        <Button
                                            component={Link}
                                            href={`/dashboard/residences/${residence.id}`}
                                            size="xs"
                                        >
                                            Άνοιγμα
                                        </Button>
                                        <Menu position="bottom-end" withinPortal>
                                            <Menu.Target>
                                                <Button size="xs" px="xs">
                                                    <i className="pi pi-chevron-down" style={{ fontSize: 12 }} />
                                                </Button>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item
                                                    component={Link}
                                                    href={`/dashboard/residences/${residence.id}/edit`}
                                                    leftSection={<i className="pi pi-pencil" />}
                                                >
                                                    Επεξεργασία
                                                </Menu.Item>
                                                <Menu.Item
                                                    color="red"
                                                    leftSection={<i className="pi pi-trash" />}
                                                    onClick={() => handleDelete(residence.id)}
                                                >
                                                    Διαγραφή
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Button.Group>
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