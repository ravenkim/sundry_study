import { client } from 'src/globals/api/client.tsx'

/** `be/app/ai/feature_registry.py` 의 카탈로그와 1:1. 새 feature 추가 시 여기 함께 갱신. */
export type FeatureKey =
    | 'bar_counter'
    | 'drink_recommend'
    | 'fridge_recipe'
    | 'late_night'

export const DEFAULT_BARTENDER_FEATURE_KEY: FeatureKey = 'bar_counter'
export const DEFAULT_CHARACTER_KEY = 'bartender_jun'

export type BackendChatMessageRow = {
    id: number
    role: 'user' | 'assistant'
    content: string
    created_at: string
}

type RoomCreatedResponse = {
    id: number
    feature_key: FeatureKey
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
 * feature 기준으로 **새 채팅방을 명시적으로 생성**합니다.
 *
 * 이전(`bootstrapBartenderSession`)처럼 가장 최근 룸을 자동 재사용하지 않습니다.
 * 같은 feature 라도 사용자가 "새 대화"를 시작했다면 새 룸이 만들어져야 history 가
 * 직전 대화와 격리됩니다.
 */
export async function createBartenderRoom(featureKey: FeatureKey): Promise<{
    roomId: number
    greeting: BackendChatMessageRow
}> {
    const res = await client.post<RoomCreatedResponse>('/api/chat/rooms', {
        feature_key: featureKey,
        character_key: DEFAULT_CHARACTER_KEY,
    })
    return {
        roomId: res.data.id,
        greeting: res.data.greeting_message,
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
