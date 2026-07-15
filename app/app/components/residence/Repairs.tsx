'use client'

import { Card, Group, Stack } from '@mantine/core'
import { IconCalendar, IconHammer } from '@tabler/icons-react'
import { dummyRepairs } from '@/app/lib/data/repairs'

export default function Repairs() {
    return (
        <Stack gap="md">
            {dummyRepairs.map(repair => (
                <Card key={repair.id} withBorder padding="md" radius="md">
                    <Group justify="space-between" align="flex-start">
                        <Group align="center" gap={12}>
                            <div style={{ background: '#fef3c7', borderRadius: '50%', width: '2.2rem', height: '2.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconHammer size={16} style={{ color: '#f59e0b' }} />
                            </div>
                            <Stack gap={4}>
                                <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.description}</span>
                                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                    <IconCalendar size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                                    {repair.date}
                                </span>
                            </Stack>
                        </Group>
                        <span style={{ fontWeight: 600, fontSize: '1rem' }}>{repair.cost}€</span>
                    </Group>
                </Card>
            ))}
        </Stack>
    )
}
