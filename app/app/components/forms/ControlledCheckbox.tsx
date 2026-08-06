
import { Checkbox } from '@mantine/core'
import { Controller } from 'react-hook-form'


export default function ControlledCheckbox({
    label, control, name, errors, onChange, disabled, required,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field }) => (
                <Checkbox
                    label={label}
                    disabled={disabled}
                    error={fieldError}
                    checked={field.value ?? false}
                    onChange={(e) => {
                        field.onChange(e.currentTarget.checked);
                        onChange?.(e);
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                />
            )}
        />
    )
}
