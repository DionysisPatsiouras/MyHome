
import { TextInput } from '@mantine/core'
import { Controller } from 'react-hook-form'


// CHECK IF PROPS EXIST

export default function ControlledTextfield({
    label, control, name, errors, placeholder, onChange, type = 'text',
    disabled, loading, helpText, autoComplete, inputMode, leftSection,
    required, minLength, maxLength, pattern, min, max,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required, minLength, maxLength, pattern }}
            render={({ field }) => (
                <TextInput
                    label={label}
                    type={type}
                    min={min}
                    max={max}
                    // placeholder={placeholder}
                    // autoComplete={autoComplete}
                    // inputMode={inputMode}
                    // leftSection={leftSection}
                    disabled={disabled || loading}
                    error={fieldError}
                    // description={!fieldError ? helpText : undefined}
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
