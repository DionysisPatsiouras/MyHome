'use client'

import { Group, Text } from '@mantine/core'

export default function SectionTitle({ label, icon: Icon, color = 'blue' }: { label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color?: string }) {

    return (
        <Group gap={8} align="center" style={{ borderLeft: `3px solid var(--mantine-color-${color}-6)`, paddingLeft: '0.5rem' }}>
            <Icon size={14} style={{ color: `var(--mantine-color-${color}-6)` }} />
            <Text fw={600} size="xs" tt="uppercase" style={{ letterSpacing: '0.05em' }} c={color}>
                {label}
            </Text>
        </Group>
    )
}
