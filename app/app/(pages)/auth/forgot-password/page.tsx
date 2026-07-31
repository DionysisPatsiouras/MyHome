'use client'

import { useState } from "react"
import Link from "next/link"

import ControlledTextfield from "@/app/components/forms/ControlledTextfield"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { ForgotPasswordFormSchema } from "@/app/lib/utils/formSchemas"
import { useCRUD } from "@/app/lib/hooks/useCRUD"

import { Anchor, Box, Button, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconBuildingEstate, IconCheck } from "@tabler/icons-react"
import { AuthRoutes } from "@/app/lib/Routes"


interface FormData {
    email: string
}

export default function ForgotPassword() {

    const { POST } = useCRUD()

    const [submitted, setSubmitted] = useState(false)

    const { control, handleSubmit, formState: { errors }, } = useForm<FormData>({
        resolver: zodResolver(ForgotPasswordFormSchema),
    })

    const formProps = { control, errors }

    const sendResetLink = (formData: FormData) => {
        setSubmitted(true)
        POST(AuthRoutes.forgotPassword, formData, true).then((res) => console.log(res))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">
            <Box w="100%" maw={400} px="md">
                <Stack align="center" mb="xl" gap="xs">
                    <ThemeIcon size={56} radius="lg" variant="gradient" gradient={{ from: 'blue', to: 'grape', deg: 90 }}>
                        <IconBuildingEstate size={28} stroke={1.75} />
                    </ThemeIcon>
                    <Title order={1} size="h2" fw={700} c="dark">MyHome</Title>
                    <Text c="dimmed" size="sm">Επαναφορά κωδικού πρόσβασης</Text>
                </Stack>

                <Paper withBorder shadow="md" radius="lg" p="xl">
                    {submitted ? (
                        <Stack align="center" ta="center" gap="sm">
                            <ThemeIcon size={48} radius="xl" color="green" variant="light">
                                <IconCheck size={24} stroke={2} />
                            </ThemeIcon>
                            <Title order={2} size="h4" fw={600} c="dark">Ελέγξτε τα email σας</Title>
                            <Text size="sm" c="dimmed">
                                Αν υπάρχει λογαριασμός με αυτό το email, θα λάβετε έναν σύνδεσμο για την επαναφορά του κωδικού σας.
                            </Text>
                        </Stack>
                    ) : (
                        <Stack gap="md">
                            <Text size="sm" c="dimmed">
                                Εισάγετε το email σας και θα σας στείλουμε έναν σύνδεσμο για να επαναφέρετε τον κωδικό πρόσβασής σας.
                            </Text>

                            <ControlledTextfield
                                label="Email"
                                name="email"
                                placeholder="you@example.com"
                                {...formProps}
                            />

                            <Button
                                onClick={handleSubmit(sendResetLink)}
                                fullWidth
                                size="md"
                                radius="md"
                                mt="xs"
                                variant="gradient"
                                gradient={{ from: 'blue', to: 'grape', deg: 90 }}
                            >
                                Αποστολή συνδέσμου
                            </Button>
                        </Stack>
                    )}
                </Paper>

                <Stack align="center" mt="lg">
                    <Anchor component={Link} href="/auth/sign-in" size="sm" fw={500}>
                        Επιστροφή στη σύνδεση
                    </Anchor>
                </Stack>
            </Box>
        </div>
    )
}
