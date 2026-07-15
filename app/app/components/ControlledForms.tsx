import { PasswordInput, TextInput } from "@mantine/core"

interface FormProps {
    id: string
    label: string
    register: any
    errors: any
    placeholder?: string
    type?: "text" | "password"
}

export const TextForm = ({ id, label, register, errors, placeholder, type = "text" }: FormProps) => {
    const Component = type === "password" ? PasswordInput : TextInput

    return (
        <Component
            id={id}
            label={label}
            placeholder={placeholder}
            error={errors?.[id]?.message}
            {...register(id)}
        />
    )

}
