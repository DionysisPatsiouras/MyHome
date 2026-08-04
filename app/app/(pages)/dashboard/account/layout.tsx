'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Grid, NavLink, Paper, Stack } from '@mantine/core'
import {
    IconBuildingEstate,
    IconCreditCard,
    IconShieldLock,
    IconUser,
} from '@tabler/icons-react'

const ACCOUNT_NAV_LINKS = [
    { label: 'Λογαριασμός', href: '/dashboard/account', icon: IconUser },
    { label: 'Ασφάλεια', href: '/dashboard/account/security', icon: IconShieldLock },
    { label: 'Πλάνο', href: '/dashboard/account/plan', icon: IconCreditCard },
    { label: 'Ακίνητα', href: '/dashboard/account/residences', icon: IconBuildingEstate },
]

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <Grid gap="lg">
            <Grid.Col span={{ base: 12, sm: 4, md: 3 }}>
                <Paper radius="md" p="xs">
                    <Stack gap={2}>
                        {ACCOUNT_NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.href}
                                component={Link}
                                href={link.href}
                                label={link.label}
                                leftSection={<link.icon size={16} />}
                                active={pathname === link.href}
                                // variant="filled"
                                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                            />
                        ))}
                    </Stack>
                </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 8, md: 9 }}>
                {children}
            </Grid.Col>
        </Grid>
    )
}
