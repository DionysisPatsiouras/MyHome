'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Badge, Button, Card, Group, SegmentedControl, Stack, Title } from '@mantine/core'
import { IconPlus, IconLayoutGrid, IconList, IconMap } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import CardView from '@/app/components/residence/CardView'
import ListView from '@/app/components/residence/ListView'
import { LocationsMap } from '@/app/components/map'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { DeleteModal } from '@/app/components/layout/DeleteModal'

import type { Residence } from '@/app/lib/types'

import { useCRUD } from '@/app/lib/hooks/useCRUD'


export default function Residences() {

    const { DELETE } = useCRUD()
    const { data: residences, loading, dataNotFound, fetchData } = useFetch(Routes('residences').list)

    const [deleteTarget, setDeleteTarget] = useState<Residence | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [view, setView] = useState<'grid' | 'list' | 'map'>('grid')

    const handleDelete = async () => {
        if (!deleteTarget) return

        setDeleting(true)

        try {
            await DELETE(Routes('residences').delete(String(deleteTarget.id)))
            setDeleteTarget(null)
            fetchData()
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) return <PageLoader />

    if (dataNotFound) {
        return (
            <DataNotFound
                title="Δεν υπάρχουν ακίνητα"
                description="Δεν έχετε προσθέσει ακόμα κάποιο ακίνητο."
                actionLabel="Νέο ακίνητο"
                actionHref="/dashboard/residences/new"
            />
        )
    }

    return (
        <Stack gap="lg">

            <DeleteModal
                opened={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Διαγραφή ακινήτου"
                description={`Είστε σίγουροι ότι θέλετε να διαγράψετε το ακίνητο "${deleteTarget?.address ?? ''} ${deleteTarget?.road_number ?? ''}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
            />


            <Group justify="space-between">
                <Group gap="xs" align="center">
                    <Title order={2}>Ακίνητα</Title>
                    <Badge variant="light" color="blue" size="lg" circle>
                        {residences.length}
                    </Badge>
                </Group>
                <Group gap="sm">
                    <SegmentedControl
                        value={view}
                        onChange={(value) => setView(value as 'grid' | 'list' | 'map')}
                        data={[
                            { label: <IconLayoutGrid size={16} />, value: 'grid' },
                            { label: <IconList size={16} />, value: 'list' },
                            { label: <IconMap size={16} />, value: 'map' },
                        ]}
                    />
                    <Button component={Link} href="/dashboard/residences/new" leftSection={<IconPlus size={16} />}>
                        Νέο ακίνητο
                    </Button>
                </Group>
            </Group>

            {view === 'grid' && <CardView residences={residences} onDelete={setDeleteTarget} />}
            {view === 'list' && <ListView residences={residences} onDelete={setDeleteTarget} />}
            {view === 'map' && (
                <Card padding={0} radius="md" withBorder style={{ overflow: 'hidden' }}>
                    <LocationsMap
                        height={520}
                        emptyMessage="Δεν υπάρχουν ακίνητα με συντεταγμένες"
                        locations={residences
                            .filter((residence: Residence) => residence.latitude && residence.longitude)
                            .map((residence: Residence) => ({
                                id: residence.id,
                                lat: Number(residence.latitude),
                                lng: Number(residence.longitude),
                                popup: (
                                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                                        <strong>{`${residence.address} ${residence.road_number ?? ''}`}</strong>
                                        <br />
                                        <span style={{ color: '#6d28d9', fontSize: 11, fontWeight: 600 }}>
                                            {residence.residenceType?.name}
                                        </span>
                                        <br />
                                        <Link href={`/dashboard/residences/${residence.id}`}>Άνοιγμα</Link>
                                    </div>
                                ),
                            }))}
                    />
                </Card>
            )}


        </Stack>
    )
}
