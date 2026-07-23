import * as z from 'zod'
import { PHONE_REGEX, ZIP_CODE_REGEX } from './regex'

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
    zip_code: z.string().regex(ZIP_CODE_REGEX, { message: "Μη έγκυρος ταχυδρομικός κώδικας" }).optional().or(z.literal('')),
    floor: z.number().optional(),
    flat_number: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    square_meters: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    construction_year: z.number().optional(),
    energy_class: z.string().optional(),
    power_supply_number: z.string().optional(),
    gas_supply_number: z.string().optional(),
})

export type NewResidenceFormValues = z.infer<typeof NewResidenceSchema>

export const NewContractSchema = z.object({
    tenant: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }),
    phone: z.string().min(1, { message: "Υποχρεωτικό πεδίο" }).regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }),
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

export const NewTechnicianSchema = z.object({
    full_name: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    technicianType_id: z.number({ message: "Επιλέξτε ειδικότητα" }),
    phone_1: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }).regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }),
    phone_2: z.string().regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }).optional().or(z.literal('')),
})

export type NewTechnicianFormValues = z.infer<typeof NewTechnicianSchema>