'use client'

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { useCRUD } from "@/app/lib/hooks/useCRUD"
import { AuthRoutes } from "@/app/lib/Routes"

import { Anchor, Box, Loader, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconBuildingEstate, IconCheck, IconX } from "@tabler/icons-react"

type VerifyState = 'loading' | 'success' | 'error'

export default function Verify() {
    return (
        <Suspense fallback={<VerifyFallback />}>
            <VerifyContent />
        </Suspense>
    )
}

function VerifyFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">
            <Loader size="md" />
        </div>
    )
}

function VerifyContent() {

    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const requestId = searchParams.get('requestId')

    const { POST } = useCRUD()

    const [state, setState] = useState<VerifyState>('loading')
    const [message, setMessage] = useState('Επιβεβαίωση του λογαριασμού σας...')

    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return
        hasRun.current = true

        if (!token || !requestId) {
            setState('error')
            setMessage('Ο σύνδεσμος επιβεβαίωσης δεν είναι έγκυρος.')
            return
        }

        POST(AuthRoutes.verifyEmail, { token, requestId }, true)
            .then((res) => {
                setState('success')
                setMessage(res.message_gr ?? 'Ο λογαριασμός επιβεβαιώθηκε με επιτυχία')
            })
            .catch((err) => {
                setState('error')
                setMessage(err?.message_gr ?? 'Δεν ήταν δυνατή η επιβεβαίωση του λογαριασμού')
            })
    }, [token, requestId])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100">
            <Box w="100%" maw={400} px="md">
                <Stack align="center" mb="xl" gap="xs">
                    <ThemeIcon size={56} radius="lg" variant="gradient" gradient={{ from: 'blue', to: 'grape', deg: 90 }}>
                        <IconBuildingEstate size={28} stroke={1.75} />
                    </ThemeIcon>
                    <Title order={1} size="h2" fw={700} c="dark">MyHome</Title>
                    <Text c="dimmed" size="sm">Επιβεβαίωση email</Text>
                </Stack>

                <Paper withBorder shadow="md" radius="lg" p="xl">
                    <Stack align="center" ta="center" gap="sm">
                        {state === 'loading' && <Loader size="md" />}
                        {state === 'success' && (
                            <ThemeIcon size={48} radius="xl" color="green" variant="light">
                                <IconCheck size={24} stroke={2} />
                            </ThemeIcon>
                        )}
                        {state === 'error' && (
                            <ThemeIcon size={48} radius="xl" color="red" variant="light">
                                <IconX size={24} stroke={2} />
                            </ThemeIcon>
                        )}

                        <Text size="sm" c="dimmed">{message}</Text>
                    </Stack>
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
