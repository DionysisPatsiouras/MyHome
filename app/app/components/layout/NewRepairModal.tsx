'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Stack } from '@mantine/core'
import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import ControlledTextarea from '@/app/components/forms/ControlledTextarea'
import { NewRepairSchema, type NewRepairFormValues } from '@/app/lib/utils/formSchemas'
import type { Repair } from '@/app/lib/types'

const NEW_REPAIR_DEFAULTS: Partial<NewRepairFormValues> = {
    cost: 0,
}

interface NewRepairModalProps {
    opened: boolean
    onClose: () => void
    onSubmit: (values: NewRepairFormValues) => void | Promise<void>
    submitting?: boolean
    repair?: Repair | null
}

export function NewRepairModal({ opened, onClose, onSubmit, submitting, repair }: NewRepairModalProps) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<NewRepairFormValues>({
        resolver: zodResolver(NewRepairSchema),
        defaultValues: NEW_REPAIR_DEFAULTS,
    })

    const formProps = { control, errors }

    useEffect(() => {
        if (!opened) return

        reset(repair ? { description: repair.description, cost: Number(repair.cost), date: repair.date } : NEW_REPAIR_DEFAULTS)
    }, [opened, repair, reset])

    const close = () => {
        reset(NEW_REPAIR_DEFAULTS)
        onClose()
    }

    const submit = handleSubmit(async values => {
        await onSubmit(values)
        close()
    })

    return (
        <Modal opened={opened} onClose={close} title={repair ? 'Επεξεργασία Επισκευής' : 'Νέα Επισκευή'} size="26rem">
            <Stack gap="sm">
                <ControlledTextarea name="description" {...formProps} label="Περιγραφή" minRows={3} autosize />

                <ControlledTextfield name="date" {...formProps} type="date" label="Ημερομηνία" />
                <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                        <NumberInput label="Κόστος (€)" min={0} error={errors.cost?.message} value={field.value} onChange={field.onChange} />
                    )}
                />


                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={close}>Άκυρο</Button>
                    <Button onClick={submit} loading={submitting}>{repair ? 'Αποθήκευση' : 'Δημιουργία'}</Button>
                </Group>
            </Stack>
        </Modal>
    )
}
