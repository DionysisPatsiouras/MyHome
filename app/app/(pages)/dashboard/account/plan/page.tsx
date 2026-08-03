'use client'

import { Badge, Button, Card, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconCheck, IconCreditCard } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

const CURRENT_PLAN = {
    name: 'Δωρεάν',
    price: '0€ / μήνα',
    features: [
        'Έως 3 ακίνητα',
        'Απεριόριστοι ενοικιαστές',
        'Βασική υποστήριξη μέσω email',
    ],
}

export default function Plan() {
    return (
        <Stack gap="lg">

            <Stack gap={6}>
                <Title order={2} fw={700}>Πλάνο</Title>
                <Text size="sm" c="dimmed">Δείτε το τρέχον πλάνο συνδρομής σας και τις δυνατότητές του.</Text>
            </Stack>

            <Card withBorder radius="md" p="lg">
                <Stack gap="md">
                    <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                            <ThemeIcon size={40} radius="md" variant="light" color="blue">
                                <IconCreditCard size={20} />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text fw={600}>{CURRENT_PLAN.name}</Text>
                                <Text size="sm" c="dimmed">{CURRENT_PLAN.price}</Text>
                            </Stack>
                        </Group>
                        <Badge variant="light" color="blue">Τρέχον πλάνο</Badge>
                    </Group>

                    <List
                        spacing="xs"
                        size="sm"
                        icon={
                            <ThemeIcon color="blue" size={18} radius="xl">
                                <IconCheck size={12} />
                            </ThemeIcon>
                        }
                    >
                        {CURRENT_PLAN.features.map((feature) => (
                            <List.Item key={feature}>{feature}</List.Item>
                        ))}
                    </List>

                    <Group justify="flex-end">
                        <Button
                            onClick={() => notifications.show({
                                color: 'yellow',
                                title: 'Αναβάθμιση πλάνου',
                                message: 'Η λειτουργία αυτή δεν είναι ακόμα διαθέσιμη',
                            })}
                        >
                            Αναβάθμιση πλάνου
                        </Button>
                    </Group>
                </Stack>
            </Card>

        </Stack>
    )
}
