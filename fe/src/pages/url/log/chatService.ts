import { Role, type Recommendation } from 'src/pages/url/log/types.ts'

type ApiChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatTurnResult = {
    content: string
    recommendation?: Recommendation
    safetyCutoffSuggested?: boolean
}

const GEMINI_GENERATE_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent'

const BARTENDER_SYSTEM = `당신은 친근한 바텐더입니다. 한국어로 따뜻하고 자연스럽게 답합니다.
손님의 분위기에 맞춰 술·안주·음악을 가볍게 제안할 수 있지만, 과도한 장문은 피합니다.
구조화된 JSON이나 마크다운 표 대신 일상 대화체로만 답합니다.`

function getGeminiApiKey(): string | undefined {
    const k = import.meta.env.VITE_GEMINI_API_KEY
    return typeof k === 'string' && k.trim() ? k.trim() : undefined
}

type GeminiPart = { text: string }
type GeminiContent = { role: 'user' | 'model'; parts: GeminiPart[] }

function toGeminiContents(
    history: { role: Role; content: string }[],
): GeminiContent[] {
    return history.map((m) => ({
        role: m.role === Role.USER ? 'user' : 'model',
        parts: [{ text: m.content }],
    }))
}

function extractGeminiText(data: unknown): string {
    if (!data || typeof data !== 'object') return ''
    const candidates = (data as { candidates?: unknown }).candidates
    if (!Array.isArray(candidates) || !candidates[0]) return ''
    const content = (candidates[0] as { content?: { parts?: unknown } })
        .content
    const parts = content?.parts
    if (!Array.isArray(parts)) return ''
    return parts
        .map((p) => (p && typeof p === 'object' && 'text' in p ? String((p as { text?: unknown }).text ?? '') : ''))
        .join('')
}

async function chatWithGemini(
    history: { role: Role; content: string }[],
): Promise<string> {
    const apiKey = getGeminiApiKey()
    if (!apiKey) throw new Error('Missing VITE_GEMINI_API_KEY')

    const contents = toGeminiContents(history)
    const res = await fetch(GEMINI_GENERATE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: BARTENDER_SYSTEM }] },
            contents,
        }),
    })

    const raw = await res.text()
    if (!res.ok) {
        throw new Error(raw || `Gemini HTTP ${res.status}`)
    }

    let parsed: unknown
    try {
        parsed = JSON.parse(raw) as unknown
    } catch {
        throw new Error('Invalid JSON from Gemini')
    }

    const text = extractGeminiText(parsed).trim()
    if (!text) throw new Error('Empty model response')
    return text
}

async function chatStub(
    history: { role: Role; content: string }[],
): Promise<ChatTurnResult> {
    await new Promise((r) => setTimeout(r, 280))

    if (history.length === 0) {
        return {
            content: '어서오세요, 단골손님! 오늘 어떤 분위기세요?',
        }
    }

    // history > 0 인 경우는 백엔드 응답이 필수. 폴백으로 가짜 답을 만들지 않고
    // 호출부에서 toast 만 띄우고 messages 에 추가되지 않도록 throw.
    throw new Error('Backend chat is required to reply.')
}

/**
 * 브라우저 전용 바텐더 대화 (백엔드 미설정 또는 폴백).
 * `messages`가 비어 있으면 오프닝 멘트를 돌려줍니다 (스펙: doc/api.md).
 *
 * 프로덕션에서 `VITE_API_HOST`를 쓰면 `be`의 `/api/chat/rooms`(룸 생성·메시지) 경로가 우선합니다.
 *
 * 로컮 전용: `VITE_GEMINI_API_KEY`가 있으면 Gemini(gemini-flash-latest). 없으면 스텁.
 */
export async function chatWithJun(
    history: { role: Role; content: string }[],
): Promise<ChatTurnResult> {
    if (history.length === 0) {
        return chatStub([])
    }

    if (getGeminiApiKey()) {
        const content = await chatWithGemini(history)
        return { content }
    }

    return chatStub(history)
}
