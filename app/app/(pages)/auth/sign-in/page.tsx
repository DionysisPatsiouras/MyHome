'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import ControlledTextfield from "@/app/components/forms/ControlledTextfield"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { SignInFormSchema } from "@/app/lib/utils/formSchemas"
import { useCRUD } from "@/app/lib/hooks/useCRUD"
import { setCookie } from "@/app/lib/utils/cookies"
import { AuthRoutes } from "@/app/lib/Routes"

import { Anchor, Box, Button, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconBuildingEstate } from "@tabler/icons-react"
import { UnverifiedAccountModal } from "@/app/components/layout/UnverifiedAccountModal"

import { notifications } from '@mantine/notifications'



interface FormData {
    email: string
    password: string
}

export default function SignIn() {

    const router = useRouter()

    const { POST } = useCRUD()

    const [unverifiedOpened, { open: openUnverified, close: closeUnverified }] = useDisclosure(false)
    const [resending, setResending] = useState(false)

    const { control, handleSubmit, getValues, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(SignInFormSchema),
    })

    const formProps = { control, errors }

    const handleResendVerification = () => {
        const email = getValues("email")

        setResending(true)

        POST(AuthRoutes.resendVerification, { email }, true, {
            success: { title: 'Επιτυχία', message: 'Το email επιβεβαίωσης εστάλη' },
            error: { title: 'Σφάλμα', message: 'Δεν ήταν δυνατή η αποστολή του email' },
        })
            .then(() => closeUnverified())
            .finally(() => setResending(false))
    }


    const signIn = (formData: any) => {

        POST(AuthRoutes.signin, formData, true).then((res) => {
            if (res.success) {
                setCookie("token", res.access)
                router.push("/dashboard/")
                return
            } else if (res.code === 109) {
                openUnverified()
            } else {
                notifications.show({
                    color: 'red',
                    title: 'Σφάλμα',
                    message: res.message_gr ?? 'Η ενέργεια απέτυχε'
                })
            }
        })
            .catch((err) => {
                notifications.show({
                    color: 'red',
                    title: 'Σφάλμα',
                    message: err.message_gr ?? 'Η ενέργεια απέτυχε'
                })
            })
    }




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">

            <UnverifiedAccountModal
                opened={unverifiedOpened}
                onClose={closeUnverified}
                onResend={handleResendVerification}
                loading={resending}
            />

            <Box w="100%" maw={400} px="md">
                <Stack align="center" mb="xl" gap="xs">
                    <ThemeIcon size={56} radius="lg" variant="gradient" gradient={{ from: 'blue', to: 'grape', deg: 90 }}>
                        <IconBuildingEstate size={28} stroke={1.75} />
                    </ThemeIcon>
                    <Title order={1} size="h2" fw={700} c="dark">MyHome</Title>
                    <Text c="dimmed" size="sm">Sign in to your account</Text>
                </Stack>

                <Paper withBorder shadow="md" radius="lg" p="xl">
                    <Stack gap="md">
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

                        <Box ta="right" mt={-8}>
                            <Anchor component={Link} href="/auth/forgot-password" size="sm" fw={500}>
                                Ξέχασα τον κωδικό μου
                            </Anchor>
                        </Box>

                        <Button
                            onClick={handleSubmit(signIn)}
                            fullWidth
                            size="md"
                            radius="md"
                            mt="xs"
                            variant="gradient"
                            gradient={{ from: 'blue', to: 'grape', deg: 90 }}
                        >
                            Σύνδεση
                        </Button>

                        <Text ta="center" size="sm" c="dimmed">
                            Δεν έχετε λογαριασμό?{' '}
                            <Anchor component={Link} href="/auth/sign-up" size="sm" fw={500}>
                                Εγγραφή
                            </Anchor>
                        </Text>
                    </Stack>
                </Paper>
            </Box>


        </div>
    )
}