'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'

import { SpeedDial } from 'primereact/speeddial'
import { Toast } from 'primereact/toast'


export default function FloatingButton() {


    const toast: any = useRef(null)
    const router = useRouter()

    const items = [
        {
            label: 'Add',
            icon: 'pi pi-home',
            command: () => {
                router.push('/dashboard/residences/new')
            }
        },
        {
            label: 'Update',
            icon: 'pi pi-file',
            command: () => {
                toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
            }
        },
        {
            label: 'Delete',
            icon: 'pi pi-wrench',
            command: () => {
                toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
            }
        },
        {
            label: 'Upload',
            icon: 'pi pi-replay',
            command: () => {
                router.push('/fileupload');
            }
        },

    ];
    return (
        <div>
            <Toast ref={toast} />

            <SpeedDial
                model={items}
                radius={120}
                type="quarter-circle"
                direction="up-left"
                style={{ position: "fixed", right: 50, bottom: 50 }}
            />

        </div>
    )
}