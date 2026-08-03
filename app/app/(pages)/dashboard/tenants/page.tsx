'use client'

import { useState } from 'react'

import { ActionIcon, Badge, Group, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { IconId, IconPencil, IconPhone, IconSearch } from '@tabler/icons-react'

import { useFetch } from '@/app/lib/hooks/useFetch'
import { Routes } from '@/app/lib/Routes'
import { DataNotFound } from '@/app/components/layout/DataNotFound'
import { PageLoader } from '@/app/components/layout/PageLoader'
import { TenantEditModal } from '@/app/components/tenants/TenantEditModal'

import type { Tenant } from '@/app/lib/types'

export default function Tenants() {

    const normalize = (str: string) =>
        str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('el')

    const { data: tenants, loading, dataNotFound, fetchData } = useFetch(Routes('tenants').list)

    const [searchValue, setSearchValue] = useState<string>('')
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)

    const filteredTenants = tenants.filter((tenant: Tenant) => {
        if (searchValue === '') return true
        const fullName = `${tenant.first_name} ${tenant.last_name}`
        return normalize(fullName).includes(normalize(searchValue)) || tenant.afm?.includes(searchValue)
    })

    if (loading) return <PageLoader />

    if (dataNotFound) {
        return (
            <DataNotFound
                title="Δεν υπάρχουν ενοικιαστές"
                description="Δεν έχετε προσθέσει ακόμα κάποιον ενοικιαστή."
            />
        )
    }

    return (
        <Stack gap="lg">

            <TenantEditModal
                tenant={selectedTenant}
                opened={!!selectedTenant}
                onClose={() => setSelectedTenant(null)}
                onSaved={fetchData}
            />

            <Group justify="space-between">
                <Group gap="xs" align="center">
                    <Title order={2}>Ενοικιαστές</Title>
                    <Badge variant="light" color="blue" size="lg" circle>
                        {tenants.length}
                    </Badge>
                </Group>
            </Group>

            <TextInput
                placeholder="Αναζήτηση με όνομα ή ΑΦΜ.."
                leftSection={<IconSearch size={16} />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
            />

            {filteredTenants.length === 0 && (
                <DataNotFound
                    title="Δεν βρέθηκαν ενοικιαστές"
                    description="Δοκιμάστε διαφορετικά κριτήρια αναζήτησης."
                />
            )}

            {filteredTenants.length > 0 && (
                <Table.ScrollContainer minWidth={500}>
                    <Table verticalSpacing="sm" highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th w="35%">Ονοματεπώνυμο</Table.Th>
                                <Table.Th w="25%">ΑΦΜ</Table.Th>
                                <Table.Th w="25%">Τηλέφωνο</Table.Th>
                                <Table.Th w="15%" />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {filteredTenants
                                .slice()
                                .sort((a: Tenant, b: Tenant) =>
                                    `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`, 'el'))
                                .map((tenant: Tenant) => (
                                    <Table.Tr
                                        key={tenant.id}
                                        onClick={() => setSelectedTenant(tenant)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <Table.Td>
                                            <Text fw={600}>{`${tenant.first_name} ${tenant.last_name}`}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap={4} c="dimmed">
                                                <IconId size={14} />
                                                <Text size="sm">{tenant.afm || '-'}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap={4} c="dimmed">
                                                <IconPhone size={14} />
                                                <Text size="sm">{tenant.phone || '-'}</Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group justify="flex-end">
                                                <ActionIcon
                                                    variant="light"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedTenant(tenant)
                                                    }}
                                                >
                                                    <IconPencil size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                        </Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            )}

        </Stack>
    )
}
