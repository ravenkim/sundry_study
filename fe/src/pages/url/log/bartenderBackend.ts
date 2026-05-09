import { client } from 'src/globals/api/client.tsx'

/** `be/app/ai/feature_registry.py` 의 기본 대화 채널과 맞춤 */
export const DEFAULT_BARTENDER_FEATURE_KEY = 'bar_counter'
export const DEFAULT_CHARACTER_KEY = 'bartender_jun'

export type BackendChatMessageRow = {
    id: number
    role: 'user' | 'assistant'
    content: string
    created_at: string
}

type RoomSummary = {
    id: number
}

type MessagesListResponse = {
    items: BackendChatMessageRow[]
}

type RoomCreatedResponse = {
    id: number
    feature_key: string
    character_key: string
    title: string | null
    created_at: string
    last_message_at: string | null
    greeting_message: BackendChatMessageRow
}

export function isBackendConfigured(): boolean {
    return Boolean(apiBaseUrl())
}

export function apiBaseUrl(): string {
    const raw = import.meta.env.VITE_API_HOST
    return typeof raw === 'string' ? raw.trim().replace(/\/$/, '') : ''
}

/**
 * 같은 feature 의 가장 최근 채팅방이 있으면 메시지를 불러오고,
 * 없으면 룸을 새로 만들고 첫 인사를 받습니다 (`doc/api.md` 흐름).
 */
export async function bootstrapBartenderSession(featureKey = DEFAULT_BARTENDER_FEATURE_KEY): Promise<{
    roomId: number
    messages: BackendChatMessageRow[]
}> {
    const listRes = await client.get<{ items: RoomSummary[] }>(
        '/api/chat/rooms',
        {
            params: {
                feature_key: featureKey,
                limit: 1,
            },
        },
    )
    const rooms = listRes.data.items ?? []
    if (rooms.length > 0) {
        const roomId = rooms[0].id
        const msgRes = await client.get<MessagesListResponse>(
            `/api/chat/rooms/${roomId}/messages`,
            { params: { limit: 200 } },
        )
        return { roomId, messages: msgRes.data.items ?? [] }
    }

    const createRes = await client.post<RoomCreatedResponse>(
        '/api/chat/rooms',
        {
            feature_key: featureKey,
            character_key: DEFAULT_CHARACTER_KEY,
        },
    )
    const greeting = createRes.data.greeting_message
    return {
        roomId: createRes.data.id,
        messages: greeting ? [greeting] : [],
    }
}

export async function sendBartenderRoomMessage(
    roomId: number,
    content: string,
): Promise<{ user_message: BackendChatMessageRow; assistant_message: BackendChatMessageRow }> {
    const res = await client.post(`/api/chat/rooms/${roomId}/messages`, {
        content,
    })
    return res.data as {
        user_message: BackendChatMessageRow
        assistant_message: BackendChatMessageRow
    }
}
