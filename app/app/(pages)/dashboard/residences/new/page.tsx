'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Dropdown } from 'primereact/dropdown'
import { Button } from "primereact/button"

import { Card } from 'primereact/card'


import { NewResidenceSchema } from "@/app/lib/formSchemas"
import { useFetch } from "@/app/lib/hooks/useFetch"
import { Routes } from "@/app/lib/Routes"

import { TextForm } from "@/app/components/ControlledForms"
import { ResidenceType } from "@/app/lib/types"

export default function NewResidence() {

    const { register, handleSubmit, formState: { errors }, } = useForm<any>({
        resolver: zodResolver(NewResidenceSchema),
    })

    const { data: residenceTypes } = useFetch(Routes('residences/types').list)



    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    const onSubmit = (formData: any) => {
        console.warn(formData)
    }

    return (
        <main className="container col-12 md:col-7">

            <p></p>
            {/* Κατηγορία must be cards */}

            <section className="grid">


                {residenceTypes.map(({ id, name }: ResidenceType) => (



                    <div className="card col-6">
                        <Card title={name}>
                            {/* <p className="m-0">
                                {name}
                            </p> */}
                        </Card>
                    </div>



                ))}

                {/* <div className="col-6 md:col-12">
                    <div className="flex flex-col gap-2">

                        <label htmlFor="username">Κατηγορία</label>
                        <Dropdown
                            options={cities}
                            optionLabel="name"
                        />

                    </div>
                </div> */}
                <div className="col-12 md:col-6">

                    <TextForm
                        id="address"
                        label="Διεύθυνση"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="col-6 md:col-3">
                    <TextForm
                        id="road_number"
                        label="Αριθμός"
                        register={register}
                        errors={errors}
                    />
                </div>





                <div className="col-6 md:col-3">
                    <div className="flex flex-col gap-2">

                        <label htmlFor="username">Οροφος</label>
                        <Dropdown
                            options={cities}
                            optionLabel="name"
                        // className="w-full" 
                        />

                    </div>
                </div>

                <div className="col-6 md:col-3">
                    <TextForm
                        id="road_number"
                        label="Τετραγωνικά"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="col-6 md:col-3">
                    <TextForm
                        id="road_number"
                        label="ΤΚ"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="col-6 md:col-3">
                    <TextForm
                        id="road_number"
                        label="Ετος κατασκεύης"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="col-6 md:col-3">
                    <TextForm
                        id="road_number"
                        label="Διαμέρισμα"
                        register={register}
                        errors={errors}
                    />
                </div>



                <div className="col-6 md:col-5">
                    <TextForm
                        id="road_number"
                        label="Αρ. Παροχής Ρευματος"
                        register={register}
                        errors={errors}
                    />
                </div>
                <div className="col-6 md:col-4">
                    <TextForm
                        id="road_number"
                        label="Αρ. Παροχής Αερίου"
                        register={register}
                        errors={errors}
                    />
                </div>

                <div className="col-6 md:col-3">
                    <div className="flex flex-col gap-2">

                        <label htmlFor="username">Ενεργειακή κατάταξη</label>
                        <Dropdown
                            options={cities}
                            optionLabel="name"
                        // className="w-full" 
                        />

                    </div>
                </div>




            </section>

            <Button onClick={handleSubmit(onSubmit)}>
                Καταχώρηση
            </Button>
        </main>
    )
}