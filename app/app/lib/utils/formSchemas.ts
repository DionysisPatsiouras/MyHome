import * as z from 'zod'
import { AFM_REGEX, PHONE_REGEX, ZIP_CODE_REGEX } from './regex'

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

export const SignUpFormSchema = z.object({
    first_name: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }).trim(),
    last_name: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }).trim(),
    birthdate: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }),
    email: z.email({ error: 'Μη έγκυρο email' }).trim(),
    password: z
        .string()
        .min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH),
            { error: `Πρέπει να έχει τουλάχιστον ${Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH)} χαρακτήρες` })
        .trim(),
    confirm_password: z.string().trim(),
}).refine(data => data.password === data.confirm_password, {
    error: 'Οι κωδικοί δεν ταιριάζουν',
    path: ['confirm_password'],
})


export const ForgotPasswordFormSchema = z.object({
    email: z.email({ error: 'Μη έγκυρο email' }).trim(),
})

export const NewResidenceSchema = z.object({
    residenceType_id: z.number({ message: "Επιλέξτε κατηγορία" }),
    city_id: z.number({ message: "Επιλέξτε πόλη" }),
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
    water_supply_number: z.string().optional(),
})

export type NewResidenceFormValues = z.infer<typeof NewResidenceSchema>

export const NewRepairSchema = z.object({
    description: z.string().max(200, { message: "Μέγιστο μήκος 200 χαρακτήρων" }).optional().or(z.literal('')),
    cost: z.number({ message: "Υποχρεωτικό πεδίο" }).nonnegative({ message: "Δεν μπορεί να είναι αρνητικό" }),
    date: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
})

export type NewRepairFormValues = z.infer<typeof NewRepairSchema>

export const RECURRENCE_UNITS = ['days', 'months', 'years'] as const

export const RECURRENCE_UNIT_IN_DAYS: Record<typeof RECURRENCE_UNITS[number], number> = {
    days: 1,
    months: 30,
    years: 365,
}

export const NewMaintenanceSchema = z.object({
    title: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    recurrenceValue: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    recurrenceUnit: z.enum(RECURRENCE_UNITS, { message: "Υποχρεωτικό πεδίο" }),
})

export type NewMaintenanceFormValues = z.infer<typeof NewMaintenanceSchema>

export type MaintenancePayload = {
    title: string
    recurrence: number
}

export const NewMaintenanceHistorySchema = z.object({
    comments: z.string().max(500, { message: "Μέγιστο μήκος 500 χαρακτήρων" }).optional().or(z.literal('')),
    cost: z.number({ message: "Υποχρεωτικό πεδίο" }).nonnegative({ message: "Δεν μπορεί να είναι αρνητικό" }),
    date: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" })
        .refine(date => date <= new Date().toISOString().slice(0, 10), { message: "Η ημερομηνία δεν μπορεί να είναι μελλοντική" }),
})

export type NewMaintenanceHistoryFormValues = z.infer<typeof NewMaintenanceHistorySchema>

export const NewTechnicianSchema = z.object({
    full_name: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    technicianType_id: z.number({ message: "Επιλέξτε ειδικότητα" }),
    phone_1: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }).regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }),
    phone_2: z.string().regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }).optional().or(z.literal('')),
    description: z.string().max(200, { message: "Μέγιστο μήκος 200 χαρακτήρων" }).optional().or(z.literal('')),
})

export type NewTechnicianFormValues = z.infer<typeof NewTechnicianSchema>

export const EditTenantSchema = z.object({
    first_name: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    last_name: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    afm: z.string({ message: "Υποχρεωτικό πεδίο" }).regex(AFM_REGEX, { message: "Μη έγκυρο ΑΦΜ" }),
    phone: z.string().regex(PHONE_REGEX, { message: "Μη έγκυρο τηλέφωνο" }).optional().or(z.literal('')),
})

export type EditTenantFormValues = z.infer<typeof EditTenantSchema>

export const TENANT_MODES = ['existing', 'new'] as const

export const NewRentalSchema = z.object({
    residence_id: z.string({ message: "Επιλέξτε ακίνητο" }),
    tenantMode: z.enum(TENANT_MODES),
    tenant_id: z.number().optional(),
    tenant_first_name: z.string().optional().or(z.literal('')),
    tenant_last_name: z.string().optional().or(z.literal('')),
    tenant_afm: z.string().optional().or(z.literal('')),
    tenant_phone: z.string().optional().or(z.literal('')),
    rent_amount: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    start_date: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    end_date: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    declaration_number: z.string().optional().or(z.literal('')),
}).refine(data => data.end_date >= data.start_date, {
    error: "Η λήξη πρέπει να είναι μετά την έναρξη",
    path: ['end_date'],
}).superRefine((data, ctx) => {
    if (data.tenantMode === 'existing') {
        if (!data.tenant_id) {
            ctx.addIssue({ code: 'custom', message: 'Επιλέξτε ενοικιαστή', path: ['tenant_id'] })
        }
        return
    }

    if (!data.tenant_first_name) {
        ctx.addIssue({ code: 'custom', message: 'Υποχρεωτικό πεδίο', path: ['tenant_first_name'] })
    }
    if (!data.tenant_last_name) {
        ctx.addIssue({ code: 'custom', message: 'Υποχρεωτικό πεδίο', path: ['tenant_last_name'] })
    }
    if (!data.tenant_afm || !AFM_REGEX.test(data.tenant_afm)) {
        ctx.addIssue({ code: 'custom', message: 'Μη έγκυρο ΑΦΜ', path: ['tenant_afm'] })
    }
    if (data.tenant_phone && !PHONE_REGEX.test(data.tenant_phone)) {
        ctx.addIssue({ code: 'custom', message: 'Μη έγκυρο τηλέφωνο', path: ['tenant_phone'] })
    }
})

export type NewRentalFormValues = z.infer<typeof NewRentalSchema>

export const EditRentalSchema = z.object({
    residence_id: z.string({ message: "Επιλέξτε ακίνητο" }),
    tenantMode: z.enum(TENANT_MODES),
    tenant_id: z.number().optional(),
    tenant_first_name: z.string().optional().or(z.literal('')),
    tenant_last_name: z.string().optional().or(z.literal('')),
    tenant_afm: z.string().optional().or(z.literal('')),
    tenant_phone: z.string().optional().or(z.literal('')),
    rent_amount: z.number({ message: "Υποχρεωτικό πεδίο" }).positive({ message: "Πρέπει να είναι μεγαλύτερο από 0" }),
    start_date: z.string({ message: "Υποχρεωτικό πεδίο" }).min(1, { message: "Υποχρεωτικό πεδίο" }),
    end_date: z.string().optional().or(z.literal('')),
    declaration_number: z.string().optional().or(z.literal('')),
}).refine(data => !data.end_date || data.end_date >= data.start_date, {
    error: "Η λήξη πρέπει να είναι μετά την έναρξη",
    path: ['end_date'],
}).superRefine((data, ctx) => {
    if (data.tenantMode === 'existing') {
        if (!data.tenant_id) {
            ctx.addIssue({ code: 'custom', message: 'Επιλέξτε ενοικιαστή', path: ['tenant_id'] })
        }
        return
    }

    if (!data.tenant_first_name) {
        ctx.addIssue({ code: 'custom', message: 'Υποχρεωτικό πεδίο', path: ['tenant_first_name'] })
    }
    if (!data.tenant_last_name) {
        ctx.addIssue({ code: 'custom', message: 'Υποχρεωτικό πεδίο', path: ['tenant_last_name'] })
    }
    if (!data.tenant_afm || !AFM_REGEX.test(data.tenant_afm)) {
        ctx.addIssue({ code: 'custom', message: 'Μη έγκυρο ΑΦΜ', path: ['tenant_afm'] })
    }
    if (data.tenant_phone && !PHONE_REGEX.test(data.tenant_phone)) {
        ctx.addIssue({ code: 'custom', message: 'Μη έγκυρο τηλέφωνο', path: ['tenant_phone'] })
    }
})

export type EditRentalFormValues = z.infer<typeof EditRentalSchema>

export const AccountDetailsSchema = z.object({
    first_name: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }).trim(),
    last_name: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }).trim(),
    birthdate: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }),
    email: z.email({ error: 'Μη έγκυρο email' }).trim(),
})

export type AccountDetailsFormValues = z.infer<typeof AccountDetailsSchema>

export const ChangePasswordSchema = z.object({
    current_password: z.string({ error: 'Υποχρεωτικό πεδίο' }).min(1, { error: 'Υποχρεωτικό πεδίο' }).trim(),
    new_password: z
        .string()
        .min(Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH),
            { error: `Πρέπει να έχει τουλάχιστον ${Number(process.env.NEXT_PUBLIC_PASSWORD_LENGTH)} χαρακτήρες` })
        .trim(),
    confirm_password: z.string().trim(),
}).refine(data => data.new_password === data.confirm_password, {
    error: 'Οι κωδικοί δεν ταιριάζουν',
    path: ['confirm_password'],
})

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>