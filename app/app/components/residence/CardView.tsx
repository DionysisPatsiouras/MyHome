'use client'

import Link from 'next/link'

import { Badge, Button, Card, Group, Menu, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { IconRulerMeasure, IconChevronDown, IconPencil, IconTrash } from '@tabler/icons-react'

import { meters } from '@/app/lib/formatter'
import { ResidenceMap } from '@/app/components/residence/ResidenceMap'

import type { Residence } from '@/app/lib/types'

interface CardViewProps {
    residences: Residence[]
    onDelete: (residence: Residence) => void
}

export default function CardView({ residences, onDelete }: CardViewProps) {
    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 2 }} spacing="lg">
            {residences.map((residence: Residence) => (
                <Card key={residence.id} padding={0} radius="md" withBorder>
                    <Card.Section>
                        <ResidenceMap
                            height={180}
                            width="100%"
                            zoom={15}
                            coordinates={[Number(residence?.latitude), Number(residence?.longitude)]}
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
                        </div>


                        <Button.Group>
                            <Button component={Link} href={`/dashboard/residences/${residence.id}`} size="xs">
                                Άνοιγμα
                            </Button>
                            <Menu position="bottom-end" withinPortal zIndex={9999}>
                                <Menu.Target>
                                    <Button size="xs" px="xs">
                                        <IconChevronDown size={14} />
                                    </Button>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        component={Link}
                                        href={`/dashboard/residences/${residence.id}/edit`}
                                        leftSection={<IconPencil size={16} />}
                                    >
                                        Επεξεργασία
                                    </Menu.Item>
                                    <Menu.Item
                                        color="red"
                                        leftSection={<IconTrash size={16} />}
                                        onClick={() => onDelete(residence)}
                                    >
                                        Διαγραφή
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Button.Group>
                    </Stack>
                </Card>
            ))}
        </SimpleGrid>
    )
}
