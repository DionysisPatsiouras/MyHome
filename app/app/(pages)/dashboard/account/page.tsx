'use client'

import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Button,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Title,
} from '@mantine/core'
import { IconMail, IconUser } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import { AccountDetailsSchema, type AccountDetailsFormValues } from '@/app/lib/utils/formSchemas'

function SectionTitle({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }) {
    return (
        <Group gap={8} align="center" style={{ borderLeft: '3px solid var(--mantine-color-blue-6)', paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <Text fw={600} size="xs" tt="uppercase" style={{ letterSpacing: '0.05em' }} c="blue">
                {label}
            </Text>
        </Group>
    )
}

export default function Account() {

    const [saving, setSaving] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountDetailsFormValues>({
        resolver: zodResolver(AccountDetailsSchema),
        defaultValues: {
            first_name: 'Jane',
            last_name: 'Spoonfighter',
            email: 'janspoon@fighter.dev',
        },
    })

    const formProps = { control, errors }

    const onSave = async () => {
        setSaving(true)

        setTimeout(() => {
            setSaving(false)
            notifications.show({
                color: 'green',
                title: 'Επιτυχία',
                message: 'Τα στοιχεία σας ενημερώθηκαν με επιτυχία',
            })
        }, 600)
    }

    return (
        <Stack gap="lg">

            <Stack gap={6}>
                <Title order={2} fw={700}>Λογαριασμός</Title>
                <Text size="sm" c="dimmed">Διαχειριστείτε τα προσωπικά σας στοιχεία.</Text>
            </Stack>

            <Paper withBorder radius="md" p="lg">
                <Stack gap="md">
                    <SectionTitle label="Προσωπικά στοιχεία" icon={IconUser} />

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <ControlledTextfield
                            name="first_name"
                            {...formProps}
                            label="Όνομα"
                            placeholder="π.χ. Γιάννης"
                            leftSection={<IconUser size={14} />}
                        />
                        <ControlledTextfield
                            name="last_name"
                            {...formProps}
                            label="Επώνυμο"
                            placeholder="π.χ. Παπαδόπουλος"
                            leftSection={<IconUser size={14} />}
                        />
                    </SimpleGrid>

                    <ControlledTextfield
                        name="email"
                        {...formProps}
                        label="Email"
                        placeholder="you@example.com"
                        leftSection={<IconMail size={14} />}
                    />

                    <Group justify="flex-end">
                        <Button onClick={handleSubmit(onSave)} loading={saving}>
                            Αποθήκευση
                        </Button>
                    </Group>
                </Stack>
            </Paper>

        </Stack>
    )
}
