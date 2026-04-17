'use client'


import { Menubar } from 'primereact/menubar'

import { MenuItems } from '@/app/lib/constants/MenuItems';

import FloatingButton from '@/app/components/FloatingButton';



export default function DashboardLayout({ children }: any) {


    return (
        <>
            <header className="card">
                <Menubar model={MenuItems} />
            </header>
            <main className='p-4'>

                {children}
                <FloatingButton />

            </main>
        </>
    )
}