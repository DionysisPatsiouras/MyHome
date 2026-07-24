

export interface BaseModel {
    createdAt: Date
    isDeleted: boolean
    deletedAt?: Date
    updatedAt?: Date
}

export interface ResidenceType {
    id: number
    name: string
}

export interface TechnicianType {
    id: number
    avatar: string
    name: string
}


export interface Residence extends BaseModel {
    id: number
    address: string
    construction_year?: number
    residenceType: ResidenceType
    latitude?: string
    longitude?: string
    road_number: string
    square_meters: string
    floor?: number | null
    flat_number?: string | null
    energy_class?: string | null
    power_supply_number?: string | null
    zip_code?: string | null
    user: number

}

export interface Maintenance {
    id: number
    title: string
    recurrence: number
    residence: number
}

export interface MaintenanceHistoryEntry {
    id: number
    maintenanceId: number
    comments: string | null
    date: string
    cost: number | null
}

export interface MaintenanceOverview {
    maintenance: Maintenance[]
    maintenance_history: MaintenanceHistoryEntry[]
    last_maintenance: string | null
    next_maintenance: string | null
    days_left: number | null
    total_cost: number
}

export interface Repair {
    id: number
    description: string
    cost: string
    date: string
    user: number
}

export interface Technician extends BaseModel {
    id: number
    full_name: string
    technicianType: TechnicianType
    phone_1?: number
    phone_2?: number
    description?: string
    user: number

}