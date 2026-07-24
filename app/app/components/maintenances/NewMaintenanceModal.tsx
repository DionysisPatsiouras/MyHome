'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Select, Stack } from '@mantine/core'
import ControlledTextfield from '@/app/components/forms/ControlledTextfield'
import {
    NewMaintenanceSchema,
    RECURRENCE_UNIT_IN_DAYS,
    type MaintenancePayload,
    type NewMaintenanceFormValues,
} from '@/app/lib/utils/formSchemas'
import type { Maintenance } from '@/app/lib/types'

const RECURRENCE_UNIT_OPTIONS = [
    { value: 'days', label: 'Ημέρες' },
    { value: 'months', label: 'Μήνες' },
    { value: 'years', label: 'Χρόνια' },
]

const NEW_MAINTENANCE_DEFAULTS: Partial<NewMaintenanceFormValues> = {
    recurrenceUnit: 'days',
}

const daysToRecurrence = (days: number): Pick<NewMaintenanceFormValues, 'recurrenceValue' | 'recurrenceUnit'> => {
    if (days % RECURRENCE_UNIT_IN_DAYS.years === 0) return { recurrenceValue: days / RECURRENCE_UNIT_IN_DAYS.years, recurrenceUnit: 'years' }
    if (days % RECURRENCE_UNIT_IN_DAYS.months === 0) return { recurrenceValue: days / RECURRENCE_UNIT_IN_DAYS.months, recurrenceUnit: 'months' }
    return { recurrenceValue: days, recurrenceUnit: 'days' }
}

interface NewMaintenanceModalProps {
    opened: boolean
    onClose: () => void
    onCreate: (values: MaintenancePayload) => void | Promise<void>
    submitting?: boolean
    maintenance?: Maintenance | null
}

export function NewMaintenanceModal({ opened, onClose, onCreate, submitting, maintenance }: NewMaintenanceModalProps) {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<NewMaintenanceFormValues>({
        resolver: zodResolver(NewMaintenanceSchema),
        defaultValues: NEW_MAINTENANCE_DEFAULTS,
    })

    const formProps = { control, errors }

    useEffect(() => {
        if (!opened) return

        reset(maintenance ? { title: maintenance.title, ...daysToRecurrence(maintenance.recurrence) } : NEW_MAINTENANCE_DEFAULTS)
    }, [opened, maintenance, reset])

    const close = () => {
        reset(NEW_MAINTENANCE_DEFAULTS)
        onClose()
    }

    const submit = handleSubmit(async values => {
        await onCreate({
            title: values.title,
            recurrence: values.recurrenceValue * RECURRENCE_UNIT_IN_DAYS[values.recurrenceUnit],
        })
        close()
    })

    return (
        <Modal opened={opened} onClose={close} title={maintenance ? 'Επεξεργασία Συντήρησης' : 'Νέα Συντήρηση'} size="26rem">
            <Stack gap="sm">
                <ControlledTextfield name="title" {...formProps} label="Τίτλος" />

                <Group gap="sm" align="flex-start" wrap="nowrap">
                    <Controller
                        name="recurrenceValue"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Συχνότητα"
                                min={1}
                                error={errors.recurrenceValue?.message}
                                value={field.value}
                                onChange={field.onChange}
                                style={{ flex: 1 }}
                            />
                        )}
                    />
                    <Controller
                        name="recurrenceUnit"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Μονάδα"
                                data={RECURRENCE_UNIT_OPTIONS}
                                error={errors.recurrenceUnit?.message}
                                value={field.value}
                                onChange={value => field.onChange(value)}
                                allowDeselect={false}
                                w={130}
                            />
                        )}
                    />
                </Group>

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={close}>Άκυρο</Button>
                    <Button onClick={submit} loading={submitting}>{maintenance ? 'Αποθήκευση' : 'Δημιουργία'}</Button>
                </Group>
            </Stack>
        </Modal>
    )
}
