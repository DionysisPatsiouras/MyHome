'use client'

import { Loader, Stack, Text } from '@mantine/core'

export function PageLoader() {
    return (
        <Stack align="center" justify="center" gap="xs" py="xl">
            <Loader size="md" />
            <Text size="sm" c="dimmed">Φόρτωση...</Text>
        </Stack>
    )
}
