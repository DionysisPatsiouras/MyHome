'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Stack } from '@mantine/core'
import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import ControlledTextarea from '@/app/components/forms/ControlledTextarea'
import { NewMaintenanceHistorySchema, type NewMaintenanceHistoryFormValues } from '@/app/lib/utils/formSchemas'
import type { MaintenanceHistoryEntry } from '@/app/lib/types'

const NEW_MAINTENANCE_HISTORY_DEFAULTS: Partial<NewMaintenanceHistoryFormValues> = {
    cost: 0,
}

interface NewMaintenanceHistoryModalProps {
    opened: boolean
    onClose: () => void
    onSubmit: (values: NewMaintenanceHistoryFormValues) => void | Promise<void>
    submitting?: boolean
    entry?: MaintenanceHistoryEntry | null
}

export function NewMaintenanceHistoryModal({ opened, onClose, onSubmit, submitting, entry }: NewMaintenanceHistoryModalProps) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<NewMaintenanceHistoryFormValues>({
        resolver: zodResolver(NewMaintenanceHistorySchema),
        defaultValues: NEW_MAINTENANCE_HISTORY_DEFAULTS,
    })

    const formProps = { control, errors }

    useEffect(() => {
        if (!opened) return

        reset(entry
            ? { date: entry.date.slice(0, 10), comments: entry.comments ?? '', cost: entry.cost ?? 0 }
            : NEW_MAINTENANCE_HISTORY_DEFAULTS)
    }, [opened, entry, reset])

    const close = () => {
        reset(NEW_MAINTENANCE_HISTORY_DEFAULTS)
        onClose()
    }

    const submit = handleSubmit(async values => {
        await onSubmit(values)
        close()
    })

    return (
        <Modal opened={opened} onClose={close} title={entry ? 'Επεξεργασία Συντήρησης' : 'Καταχώρηση Συντήρησης'} size="26rem">
            <Stack gap="sm">
                <ControlledTextfield name="date" {...formProps} type="date" label="Ημερομηνία" max={new Date().toISOString().slice(0, 10)} />
                <ControlledTextarea name="comments" {...formProps} label="Σχόλια" minRows={3} autosize />
                <Controller
                    name="cost"
                    control={control}
                    render={({ field }) => (
                        <NumberInput label="Κόστος (€)" min={0} error={errors.cost?.message} value={field.value} onChange={field.onChange} />
                    )}
                />

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={close}>Άκυρο</Button>
                    <Button onClick={submit} loading={submitting}>{entry ? 'Αποθήκευση' : 'Καταχώρηση'}</Button>
                </Group>
            </Stack>
        </Modal>
    )
}
