'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Modal, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { NewContractSchema, type NewContractFormValues } from '@/app/lib/formSchemas'

const NEW_CONTRACT_DEFAULTS: Partial<NewContractFormValues> = {
    status: 'Ενεργό',
    monthly_rent: 0,
    deposit: 0,
}

interface NewContractModalProps {
    opened: boolean
    onClose: () => void
    onCreate: (values: NewContractFormValues) => void
}

export function NewContractModal({ opened, onClose, onCreate }: NewContractModalProps) {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<NewContractFormValues>({
        resolver: zodResolver(NewContractSchema),
        defaultValues: NEW_CONTRACT_DEFAULTS,
    })

    const close = () => {
        reset(NEW_CONTRACT_DEFAULTS)
        onClose()
    }

    const submit = handleSubmit(values => {
        onCreate(values)
        close()
    })

    return (
        <Modal opened={opened} onClose={close} title="Νέο Συμβόλαιο" size="36rem">
            <Stack gap="sm">
                <TextInput label="Ενοικιαστής" error={errors.tenant?.message} {...register('tenant')} />
                <TextInput label="Τηλέφωνο" error={errors.phone?.message} {...register('phone')} />
                <TextInput label="Email" error={errors.email?.message} {...register('email')} />
                <TextInput type="date" label="Έναρξη" error={errors.start_date?.message} {...register('start_date')} />
                <TextInput type="date" label="Λήξη" error={errors.end_date?.message} {...register('end_date')} />
                <Controller
                    name="monthly_rent"
                    control={control}
                    render={({ field }) => (
                        <NumberInput label="Μηνιαίο ενοίκιο (€)" min={0} error={errors.monthly_rent?.message} value={field.value} onChange={field.onChange} />
                    )}
                />
                <Controller
                    name="deposit"
                    control={control}
                    render={({ field }) => (
                        <NumberInput label="Εγγύηση (€)" min={0} error={errors.deposit?.message} value={field.value} onChange={field.onChange} />
                    )}
                />
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select label="Κατάσταση" data={['Ενεργό', 'Ληγμένο']} allowDeselect={false} error={errors.status?.message} value={field.value} onChange={value => field.onChange(value ?? 'Ενεργό')} />
                    )}
                />
                <Textarea label="Σημειώσεις" error={errors.notes?.message} {...register('notes')} />

                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={close}>Άκυρο</Button>
                    <Button onClick={submit}>Δημιουργία</Button>
                </Group>
            </Stack>
        </Modal>
    )
}
