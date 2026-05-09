export enum Role {
    USER = 'user',
    MODEL = 'model',
}

export type Recommendation = {
    title: string
    description: string
    foodPairing: string
    musicLabel: string
    musicUrl?: string
}

export type Message = {
    id: string
    role: Role
    content: string
    timestamp: Date
    recommendation?: Recommendation
}
