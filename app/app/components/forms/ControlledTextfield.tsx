
import { PasswordInput, TextInput } from '@mantine/core'
import { Controller } from 'react-hook-form'


export default function ControlledTextfield({
    label, control, name, errors, onChange, type = 'text',
    disabled, loading, required, minLength, maxLength, pattern, min, max,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined
    const Input = type === 'password' ? PasswordInput : TextInput

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required, minLength, maxLength, pattern }}
            render={({ field }) => (
                <Input
                    label={label}
                    {...(type === 'password' ? {} : { type })}
                    min={min}
                    max={max}
                    disabled={disabled || loading}
                    error={fieldError}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                        field.onChange(e);
                        onChange?.(e as React.ChangeEvent<HTMLInputElement>);
                    }}
                />
            )}
        />
    )
}
