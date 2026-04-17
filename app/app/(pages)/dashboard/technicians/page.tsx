'use client'

import { useState, useRef } from 'react'

import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { ConfirmDialog } from 'primereact/confirmdialog'

import { confirmDelete } from '@/app/lib/confirmDelete'

import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"

import type { Technician } from "@/app/lib/types"

export default function Technicians() {
    // const toast = useRef(null)


    const normalize = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el')


    const { data: technicians } = useFetch(Routes('technicians').list)

    const [selection, setSelection] = useState<number>()

    const [searchValue, setSearchValue] = useState<string>("")


    // const accept = () => {
    //     alert("tst")
    //     toast.current.show({ severity: 'info', summary: 'Επιβεβαίωση', detail: 'Η καταχώρηση διαγράφηκε επιτυχώς', life: 3000 });
    // }

    // const reject = () => {
    //     toast.current.show({ severity: 'warn', summary: 'Ακύρωση', detail: 'Η διαγραφή ακυρώθηκε', life: 3000 });
    // }

    const handleDelete = (technician: Technician) => {
        setSelection(technician?.id)
        confirmDelete()
        // confirmDialog({
        //     message: 'Θέλετε να διαγράψετε αυτή την καταχώρηση;',
        //     header: 'Διαγραφή',
        //     icon: 'pi pi-info-circle',
        //     defaultFocus: 'reject',
        //     acceptClassName: 'p-button-danger',
        //     acceptLabel: 'Διαγραφή',
        //     rejectLabel: 'Άκυρο',
        //     accept,
        //     reject
        // });
    }

    return (
        <main className='container'>


            1. [delete with modal pending]
            <br></br>
            2. [edit technician]

            {/* <Toast ref={toast} /> */}
            <ConfirmDialog />

            <section className='pb-4'>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                    <InputText placeholder="Αναζήτηση.." onChange={(e: any) => setSearchValue(e.target.value.toLocaleLowerCase())} />
                </div>

            </section>



            <section className='grid'>
                {technicians
                    .filter((item: Technician) => searchValue === ""
                        ? item
                        : item?.full_name && normalize(item.full_name).includes(normalize(searchValue)))
                    .map((item: Technician) => (
                        <div key={`${item?.id}-${item?.full_name}`} className='col-12 md:col-6 p-2'>
                            <Card
                                title={
                                    <div className='flex flex-column mb-4'>
                                        {item?.full_name}
                                        <small style={{ fontWeight: 500, fontSize: 14 }}>{item?.technicianType?.name}</small>
                                    </div>
                                }
                            >
                                <div className='flex gap-2 align-items-center mb-2'>
                                    <i className='pi pi-phone' />
                                    <p className="m-0">{item?.phone_1}</p>
                                </div>
                                <div className='flex gap-2 align-items-center'>
                                    <i className='pi pi-phone' />
                                    <p className="m-0">{item?.phone_2 || "-"}</p>
                                </div>

                                <div className='flex gap-2 mt-3'>
                                    <Button icon="pi pi-pencil" rounded text raised />
                                    <Button icon="pi pi-trash" onClick={() => handleDelete(item)} severity="danger" rounded text raised />

                                </div>

                            </Card>
                        </div>
                    ))
                }
            </section>


        </main>
    )
}