'use client'


import { TextForm } from "@/app/components/ControlledForms"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormSchema } from "@/app/lib/formSchemas"
import { useCRUD } from "@/app/lib/hooks/useCRUD"


import { Card } from "primereact/card"
import { Routes, AuthRoutes } from "@/app/lib/Routes"

// import { POST } from "@/app/api/signin/route"
import { includes } from "zod"

import { useFetch } from "@/app/lib/hooks/useFetch"

interface FormData {
    email: string
    password: string
}

export default function SignIn() {



    const { POST } = useCRUD()

    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(SignInFormSchema),
    })

    const formProps = { register, errors }


    const signIn = (formData: any) => {

        POST(AuthRoutes.signin, formData).then((res) => {
            console.log(res)
            // localStorage.setItem("token", res.access)
            cookieStore.set("token", res.access)
        })
    }

    // const signIn = (formData: FormData) => {
    //     POST(formData) // important
    //         .then((res: any) => {
    //             console.log(res.json()); // success message
    //         })
    //         .catch((err: any) => {
    //             console.error(err);
    //         });
    // };


    return (
        <>


            <div className="card">
                <Card title="Simple Card">
                    <TextForm
                        label="EMAIL"
                        id="email"
                        {...formProps}
                    />
                    <TextForm
                        label="PASSWORD"
                        id="password"
                        {...formProps}
                    />
                </Card>
            </div>



            <button onClick={handleSubmit(signIn)}>
                sign-in

            </button>



        </>
    )
}