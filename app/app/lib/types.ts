

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
    road_number: string
    square_meters: string
    user: number

}

export interface Technician extends BaseModel {
    id: number
    full_name: string
    technicianType: TechnicianType
    phone_1?: number
    phone_2?: number
    user: number

}