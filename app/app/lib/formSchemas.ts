import * as z from 'zod'

export const SignInFormSchema = z.object({
    email: z.email({ error: 'Please enter a valid email.' }).trim(),
    password: z
        .string()

        // .min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH), 'Password is required')
        .min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH),
            { error: `Be at least ${Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH)} characters long` })
        // .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
        // .regex(/[0-9]/, { error: 'Contain at least one number.' })
        // .regex(/[^a-zA-Z0-9]/, {
        //     error: 'Contain at least one special character.',
        // })
        .trim(),
})


export const NewResidenceSchema = z.object({
    address: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    road_number: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    floor: z.number({ message: "Υποχρεωτικό πεδίο" })
})