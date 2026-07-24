
import { Textarea } from '@mantine/core'
import { Controller } from 'react-hook-form'


// CHECK IF PROPS EXIST

export default function ControlledTextarea({
    label, control, name, errors, placeholder, onChange,
    disabled, loading, helpText, autoComplete, rows, autosize, minRows, maxRows,
    required, minLength, maxLength, pattern,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required, minLength, maxLength, pattern }}
            render={({ field }) => (
                <Textarea
                    label={label}
                    // placeholder={placeholder}
                    // autoComplete={autoComplete}
                    rows={rows}
                    autosize={autosize}
                    minRows={minRows}
                    maxRows={maxRows}
                    disabled={disabled || loading}
                    error={fieldError}
                    // description={!fieldError ? helpText : undefined}
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                        field.onChange(e);
                        onChange?.(e as React.ChangeEvent<HTMLTextAreaElement>);
                    }}
                />
            )}
        />
    )
}
