export const dummyRepairs = [
    {
        id: 1,
        description: 'Αντικατάσταση βρύσης κουζίνας',
        cost: 120,
        date: '2025-03-10',
    },
    {
        id: 2,
        description: 'Επισκευή ηλεκτρολογικού πίνακα',
        cost: 340,
        date: '2025-07-22',
    },
    {
        id: 3,
        description: 'Βάψιμο εσωτερικών χώρων',
        cost: 800,
        date: '2024-11-05',
    },
]

export type Repair = typeof dummyRepairs[0]
