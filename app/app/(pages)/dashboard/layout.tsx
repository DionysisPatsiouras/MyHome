'use client'

import { Grid } from '@mantine/core'
import { DashboardHeader } from '@/app/components/DashboardHeader'
import { NotificationsProvider } from '@/app/contexts/NotificationsContext'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {


    return (
        <NotificationsProvider>
            <header>
                <DashboardHeader />
            </header>

            <main className='p-4'>
                <Grid justify="center">
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        {children}
                    </Grid.Col>
                </Grid>
            </main>
        </NotificationsProvider>
    )
}
