'use client'

import Link from 'next/link'
import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { IconHome } from '@tabler/icons-react'

export default function PageNotFound() {
    return (
        <Center mih="100vh" p="md">
            <Stack align="center" gap="sm" maw={420}>

                <Title order={1} fw={800} size={72} c="blue.6" lh={1}>
                    404
                </Title>

                <Title order={2} size="h3" ta="center">
                    Η σελίδα δεν βρέθηκε
                </Title>

                <Text c="dimmed" ta="center">
                    Η σελίδα που ψάχνετε δεν υπάρχει ή έχει μετακινηθεί.
                </Text>

                <Button
                    component={Link}
                    href="/dashboard"
                    leftSection={<IconHome size={18} />}
                    color="blue"
                    size="md"
                    mt="md"
                >
                    Επιστροφή στην αρχική
                </Button>
            </Stack>
        </Center>
    )
}
