import { DatePickerInput } from '@mantine/dates'
import { Controller } from 'react-hook-form'
import dayjs from 'dayjs'

// Stores the value as a 'YYYY-MM-DD' string (like a native <input type="date">)
// so it stays compatible with the rest of the form/schema.

export default function ControlledDatePicker({
    label, control, name, errors, placeholder, onChange,
    disabled, leftSection, required, minDate, maxDate, clearable = true,
}: any) {
    const fieldError = errors?.[name]?.message as string | undefined

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field }) => (
                <DatePickerInput
                    label={label}
                    placeholder={placeholder}
                    leftSection={leftSection}
                    disabled={disabled}
                    error={fieldError}
                    minDate={minDate}
                    maxDate={maxDate}
                    clearable={clearable}
                    valueFormat="DD/MM/YYYY"
                    highlightToday
                    firstDayOfWeek={1}
                    ref={field.ref}
                    value={field.value ? dayjs(field.value).toDate() : null}
                    onChange={(value) => {
                        const nextValue = value ? dayjs(value).format('YYYY-MM-DD') : ''
                        field.onChange(nextValue)
                        onChange?.(nextValue)
                    }}
                />
            )}
        />
    )
}
