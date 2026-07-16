'use client'

import ControlledTextfield from "@/app/components/forms/ControlledTextfield"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormSchema } from "@/app/lib/formSchemas"
import { useCRUD } from "@/app/lib/hooks/useCRUD"

import { AuthRoutes } from "@/app/lib/Routes"

import { useRouter } from "next/navigation"


interface FormData {
    email: string
    password: string
}

export default function SignIn() {

    const router = useRouter()



    const { POST } = useCRUD()

    const { control, handleSubmit, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(SignInFormSchema),
    })

    const formProps = { control, errors }


    const signIn = (formData: any) => {

        POST(AuthRoutes.signin, formData).then((res) => {
            console.log(res)
            cookieStore.set("token", res.access)
            router.push("/dashboard/")
        })
    }




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">
            <div className="w-full max-w-md px-4">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">MyHome</h1>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col gap-5">
                        <ControlledTextfield
                            label="Email"
                            name="email"
                            placeholder="you@example.com"
                            {...formProps}
                        />
                        <ControlledTextfield
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            {...formProps}
                        />

                        <button
                            onClick={handleSubmit(signIn)}
                            className="mt-2 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl transition-colors duration-150 shadow-sm cursor-pointer"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}