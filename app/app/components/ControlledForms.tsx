import { InputText } from "primereact/inputtext"
import { Dropdown } from 'primereact/dropdown'


interface FormProps {
    id: string
    label: string
    register: any
    errors: any
    placeholder?: string
    type?: "text" | "password"
}

export const TextForm = ({ id, label, register, errors, placeholder, type = "text" }: FormProps) => {
    return (
        <div className="flex flex-col gap-2">

            <label htmlFor="username">{label}</label>
            <InputText
                type={type}
                id={id} aria-describedby="username-help"
                placeholder={placeholder}
                {...register(id)}
            />
            {errors?.[id]?.message &&
                <small id="username-help" style={{ color: "#c52828" }}>
                    {errors?.[id]?.message}
                </small>
            }
        </div>
    )

}
