import { Select } from '@mantine/core'
import { Controller } from 'react-hook-form'




export default function ControlledSelect({
    label, control, name, errors, placeholder, onChange, data,
    disabled, loading, helpText, leftSection, clearable, searchable,
    required, nothingFoundMessage,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field }) => (
                <Select
                    label={label}
                    placeholder={placeholder}
                    data={data}
                    leftSection={leftSection}
                    disabled={disabled || loading}
                    error={fieldError}
                    description={!fieldError ? helpText : undefined}
                    clearable={clearable}
                    searchable={searchable}
                    nothingFoundMessage={nothingFoundMessage}
                    {...field}
                    value={field.value ?? null}
                    onChange={(value, option) => {
                        field.onChange(value ?? undefined);
                        onChange?.(value, option);
                    }}
                />
            )}
        />
    )
}
