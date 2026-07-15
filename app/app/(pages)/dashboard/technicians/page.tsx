'use client'

import { useState } from 'react'


import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"

import type { Technician, TechnicianType } from "@/app/lib/types"

export default function Technicians() {


    const normalize = (str: string) =>
        str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('el')


    const { data: technicians } = useFetch(Routes('technicians').list)
    // const { data: technicianTypes } = useFetch(customRoute('technicians/types'))


    const [searchValue, setSearchValue] = useState<string>("")
    const [selectedType, setSelectedType] = useState<TechnicianType | null>(null)


    return (
        <main className='container'>


            <section className='pb-4'>
                <h2 className='mt-0 mb-2'>Τεχνικοί</h2>
                <p className='m-0 text-color-secondary'>
                    Εδώ μπορείτε να αποθηκεύσετε όλους τους τεχνικούς που συνεργάζεστε, ώστε να είναι διαθέσιμοι για μελλοντική χρήση σε επισκευές και συντηρήσεις.
                </p>
            </section>

            <section className='pb-4 flex gap-2'>

                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                    {/* <InputText placeholder="Αναζήτηση.." onChange={(e: any) => setSearchValue(e.target.value.toLocaleLowerCase())} /> */}
                </div>

                {/* <Dropdown
                    value={selectedType}
                    options={[{ id: null, name: 'Όλοι' }, ...technicianTypes]}
                    onChange={(e) => setSelectedType(e.value)}
                    optionLabel="name"
                    placeholder="Τύπος τεχνικού"
                /> */}

            </section>



            <section className='grid'>
                {technicians
                    .filter((item: Technician) => searchValue === ""
                        ? item
                        : item?.full_name && normalize(item.full_name).includes(normalize(searchValue)))
                    .filter((item: Technician) => !selectedType || selectedType.id === null || item?.technicianType?.id === selectedType.id)
                    .map((item: Technician) => (
                        <div key={`${item?.id}-${item?.full_name}`} className='col-12 md:col-6 p-2'>
                            {/* <Card
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

                            </Card> */}
                        </div>
                    ))
                }
            </section>


        </main>
    )
}