'use client'

import { Grid } from '@mantine/core'
import { DashboardHeader } from '@/app/components/DashboardHeader'


export default function DashboardLayout({ children }: any) {


    return (
        <>
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
        </>
    )
}