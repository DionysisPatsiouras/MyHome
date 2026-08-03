'use client'

import Link from 'next/link'

import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconRulerMeasure, IconPencil, IconMapPin } from '@tabler/icons-react'

import { meters } from '@/app/lib/utils/formatter'
import { LocationsMap } from '@/app/components/map'

import type { Residence } from '@/app/lib/types'

interface CardViewProps {
    residences: Residence[]
}

export default function CardView({ residences }: CardViewProps) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="lg">
            {residences.map((residence: Residence) => (
                <Card key={residence.id} padding={0} radius="md" withBorder>
                    <Card.Section>
                        <LocationsMap
                            height={180}
                            zoom={15}
                            locations={
                                residence.latitude && residence.longitude
                                    ? [
                                        {
                                            id: residence.id,
                                            lat: Number(residence.latitude),
                                            lng: Number(residence.longitude),
                                        },
                                    ]
                                    : []
                            }
                        />
                    </Card.Section>

                    <Stack gap="xs" p="md">
                        <div>
                            <Title order={4} fw={700}>
                                {`${residence.address} ${residence?.road_number ?? ''}`}
                            </Title>
                            <Group gap="xs" mt={4}>
                                <Badge variant="light" color="violet">
                                    {residence.residenceType?.name}
                                </Badge>
                                <Group gap={4} c="dimmed">
                                    <IconRulerMeasure size={14} />
                                    <Text size="sm" c="dimmed">
                                        {meters(residence.square_meters)}
                                    </Text>
                                </Group>
                            </Group>
                            {residence.city && (
                                <Group gap={4} c="dimmed" mt={4}>
                                    <IconMapPin size={14} />
                                    <Text size="sm" c="dimmed">
                                        {residence.city.name}
                                    </Text>
                                </Group>
                            )}
                        </div>


                        <Group gap="xs">
                            <Button
                                component={Link}
                                href={`/dashboard/residences/${residence.id}`}
                                size="xs"
                            >
                                Άνοιγμα
                            </Button>

                            <Button
                                component={Link}
                                href={`/dashboard/residences/${residence.id}/edit`}
                                size="xs"
                                px="xs"
                                variant="light"
                                color="gray"
                            >
                                <IconPencil size={14} />
                            </Button>

                        </Group>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    )
}
