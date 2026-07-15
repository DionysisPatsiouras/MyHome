'use client'

import { useState } from 'react'
import Link from 'next/link'

import { Badge, Button, Group, SegmentedControl, Select, Stack, TextInput, Title } from '@mantine/core'
import { IconLayoutGrid, IconList, IconPlus, IconSearch } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { useCRUD } from '@/app/lib/hooks/useCRUD'
import { Routes, customRoute } from '@/app/lib/Routes'
import CardView from '@/app/components/technician/CardView'
import ListView from '@/app/components/technician/ListView'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { DeleteModal } from '@/app/components/layout/DeleteModal'

import type { Technician, TechnicianType } from '@/app/lib/types'

export default function Technicians() {

    const normalize = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el')

    const { DELETE } = useCRUD()
    const { data: technicians, loading, dataNotFound, fetchData } = useFetch(Routes('technicians').list)
    const { data: technicianTypes } = useFetch(customRoute('technicians/types'))

    const [searchValue, setSearchValue] = useState<string>('')
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
    const [view, setView] = useState<'grid' | 'list'>('grid')

    const [deleteTarget, setDeleteTarget] = useState<Technician | null>(null)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        if (!deleteTarget) return

        setDeleting(true)

        try {
            DELETE(Routes('technicians').delete(String(deleteTarget.id)))
            setDeleteTarget(null)
            fetchData()
        } catch (err) {
            console.error(err)
        } finally {
            setDeleting(false)
        }
    }

    const filteredTechnicians = technicians
        .filter((item: Technician) =>
            searchValue === '' ? item : item?.full_name && normalize(item.full_name).includes(normalize(searchValue)))
        .filter((item: Technician) => !selectedTypeId || item?.technicianType?.id === Number(selectedTypeId))

    if (loading) return <PageLoader />

    if (dataNotFound) {
        return (
            <DataNotFound
                title="Δεν υπάρχουν τεχνικοί"
                description="Δεν έχετε προσθέσει ακόμα κάποιον τεχνικό."
                actionLabel="Νέος τεχνικός"
                actionHref="/dashboard/technicians/new"
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
                title="Διαγραφή τεχνικού"
                description={`Είστε σίγουροι ότι θέλετε να διαγράψετε τον τεχνικό "${deleteTarget?.full_name ?? ''}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
            />

            <Group justify="space-between">
                <Group gap="xs" align="center">
                    <Title order={2}>Τεχνικοί</Title>
                    <Badge variant="light" color="blue" size="lg" circle>
                        {technicians.length}
                    </Badge>
                </Group>
                <Group gap="sm">
                    <SegmentedControl
                        value={view}
                        onChange={(value) => setView(value as 'grid' | 'list')}
                        data={[
                            { label: <IconLayoutGrid size={16} />, value: 'grid' },
                            { label: <IconList size={16} />, value: 'list' },
                        ]}
                    />
                    <Button component={Link} href="/dashboard/technicians/new" leftSection={<IconPlus size={16} />}>
                        Νέος τεχνικός
                    </Button>
                </Group>
            </Group>

            <Group gap="sm">
                <TextInput
                    placeholder="Αναζήτηση.."
                    leftSection={<IconSearch size={16} />}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ flex: 1 }}
                />
                <Select
                    placeholder="Τύπος τεχνικού"
                    data={[
                        { value: 'all', label: 'Όλες οι ειδικότητες' },
                        ...technicianTypes.map((type: TechnicianType) => ({ value: String(type.id), label: type.name })),
                    ]}
                    value={selectedTypeId ?? 'all'}
                    onChange={(value) => setSelectedTypeId(value === 'all' ? null : value)}
                    w={220}
                />
            </Group>

            {filteredTechnicians.length === 0 && (
                <DataNotFound
                    title="Δεν βρέθηκαν τεχνικοί"
                    description="Δοκιμάστε διαφορετικά κριτήρια αναζήτησης ή φιλτραρίσματος."
                />
            )}

            {filteredTechnicians.length > 0 && view === 'grid' && (
                <CardView technicians={filteredTechnicians} onDelete={setDeleteTarget} />
            )}
            {filteredTechnicians.length > 0 && view === 'list' && (
                <ListView technicians={filteredTechnicians} onDelete={setDeleteTarget} />
            )}

        </Stack>
    )
}
