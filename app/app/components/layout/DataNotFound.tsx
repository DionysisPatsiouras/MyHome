'use client'

import Link from 'next/link'

import { Button, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconDatabaseOff } from '@tabler/icons-react'

import type { ComponentType } from 'react'

type DataNotFoundProps = {
    title?: string
    description?: string
    icon?: ComponentType<{ size?: number; stroke?: number }>
    actionLabel?: string
    actionHref?: string
    onAction?: () => void
}

export function DataNotFound({
    title = 'Δεν βρέθηκαν δεδομένα',
    description,
    icon: Icon = IconDatabaseOff,
    actionLabel,
    actionHref,
    onAction,
}: DataNotFoundProps) {
    return (
        <Stack align="center" justify="center" gap="xs" py="xl">
            <ThemeIcon size={56} radius="xl" variant="light" color="gray">
                <Icon size={28} stroke={1.5} />
            </ThemeIcon>

            <Title order={4} ta="center">{title}</Title>

            {description && (
                <Text size="sm" c="dimmed" ta="center" maw={360}>
                    {description}
                </Text>
            )}

            {actionLabel && (actionHref
                ? (
                    <Button component={Link} href={actionHref} mt="sm" size="xs">
                        {actionLabel}
                    </Button>
                )
                : (
                    <Button onClick={onAction} mt="sm" size="xs">
                        {actionLabel}
                    </Button>
                )
            )}
        </Stack>
    )
}
