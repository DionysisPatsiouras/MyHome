'use client'

import ControlledTextfield from "@/app/components/forms/ControlledTextfield"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { SignUpFormSchema } from "@/app/lib/utils/formSchemas"

import { Button } from "@mantine/core"
import { IconBuildingEstate } from "@tabler/icons-react"
import { AppMockup } from "@/app/components/illustrations/AppMockup"

import Link from "next/link"


interface FormData {
    full_name: string
    email: string
    password: string
    confirm_password: string
}

export default function SignUp() {

    const { control, handleSubmit, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(SignUpFormSchema),
    })

    const formProps = { control, errors }


    const signUp = (formData: any) => {
        console.log(formData)
    }


    return (
        <div className="min-h-screen flex bg-white dark:bg-black">
            {/* Left panel — form */}
            <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-16 py-10">
                <Link href="/" className="flex items-center gap-2 mb-16">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundImage: 'linear-gradient(135deg, #4dabf7, #be4bdb)' }}
                    >
                        <IconBuildingEstate className="w-4.5 h-4.5 text-white" size={18} stroke={1.75} />
                    </div>
                    <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">MyHome</span>
                </Link>

                <div className="flex-1 flex items-center">
                    <div className="w-full max-w-sm mx-auto">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Καλώς ήρθες στο MyHome
                        </h1>
                        <p className="text-zinc-500 mt-2 mb-8">
                            Ξεκίνα τώρα — δωρεάν, χωρίς πιστωτική κάρτα.
                        </p>

                        <div className="flex flex-col gap-4">
                            <ControlledTextfield
                                label="Ονοματεπώνυμο"
                                name="full_name"
                                placeholder="Γιάννης Παπαδόπουλος"
                                {...formProps}
                            />
                            <ControlledTextfield
                                label="Email"
                                name="email"
                                placeholder="you@example.com"
                                {...formProps}
                            />
                            <ControlledTextfield
                                label="Κωδικός πρόσβασης"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                {...formProps}
                            />
                            <ControlledTextfield
                                label="Επιβεβαίωση κωδικού"
                                name="confirm_password"
                                type="password"
                                placeholder="••••••••"
                                {...formProps}
                            />

                            <Button
                                onClick={handleSubmit(signUp)}
                                fullWidth
                                size="md"
                                radius="md"
                                mt="xs"
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'grape', deg: 90 }}
                            >
                                Συνέχεια
                            </Button>
                        </div>

                        <p className="text-center text-sm text-zinc-500 mt-8">
                            Έχεις ήδη λογαριασμό;{' '}
                            <Link href="/auth/sign-in" className="text-blue-600 hover:text-blue-500 font-medium">
                                Σύνδεση
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel — illustration */}
            <div
                className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center"
                style={{ backgroundImage: 'linear-gradient(135deg, #4dabf7, #7048e8)' }}
            >
                <div className="pointer-events-none absolute top-16 left-16 h-40 w-40 rounded-full border border-white/20" />
                <div className="pointer-events-none absolute bottom-0 right-[-4rem] h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute top-10 right-24 h-16 w-16 rounded-full bg-yellow-300/90 shadow-lg" />
                <div className="pointer-events-none absolute bottom-24 left-24 h-4 w-4 rounded-full bg-green-300/90" />

                <div className="relative rotate-2">
                    <AppMockup />
                </div>
            </div>
        </div>
    )
}
