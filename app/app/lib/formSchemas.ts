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
    residenceType: z.number({ message: "Επιλέξτε κατηγορία" }),
    address: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    road_number: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    zip_code: z.string().optional(),
    floor: z.number().optional(),
    flat_number: z.string().optional(),
    square_meters: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    construction_year: z.number().optional(),
    energy_class: z.string().optional(),
    power_supply_number: z.string().optional(),
    gas_supply_number: z.string().optional(),
})

export type NewResidenceFormValues = z.infer<typeof NewResidenceSchema>

export const NewContractSchema = z.object({
    tenant: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    phone: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    email: z.email({ error: 'Μη έγκυρο email' }),
    start_date: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    end_date: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    monthly_rent: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    deposit: z.number({ message: "Υποχρεωτικό πεδίο" }).nonnegative({ message: "Δεν μπορεί να είναι αρνητικό" }),
    status: z.enum(['Ενεργό', 'Ληγμένο']),
    notes: z.string().optional(),
}).refine(data => data.end_date >= data.start_date, {
    error: 'Η λήξη πρέπει να είναι μετά την έναρξη',
    path: ['end_date'],
})

export type NewContractFormValues = z.infer<typeof NewContractSchema>