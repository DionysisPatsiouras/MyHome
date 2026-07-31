'use client'

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
import { IconBuildingEstate } from "@tabler/icons-react"



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
            setCookie("token", res.access)
            router.push("/dashboard/")
        }).catch(() => { })
    }




    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">
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
                    </Stack>
                </Paper>
            </Box>
        </div>
    )
}