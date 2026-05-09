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
    /*
    const { data } = await client.post<{
        reply: string
        safetyCutoffSuggested?: boolean
        recommendation: null | {
            drink: { name: string; abv?: string; description?: string }
            snack: string
            music: { title: string; youtubeSearchUrl: string }
        }
    }>('/api/chat', { messages })

    const rec = data.recommendation
    return {
        content: data.reply,
        recommendation: rec
            ? {
                  title: rec.drink.name,
                  description: rec.drink.description?.trim() ?? '',
                  foodPairing: rec.snack,
                  musicLabel: rec.music.title,
                  musicUrl: rec.music.youtubeSearchUrl,
              }
            : undefined,
        safetyCutoffSuggested: data.safetyCutoffSuggested,
    }
    */

    await new Promise((r) => setTimeout(r, 280))

    const messages: ApiChatMessage[] = history.map((m) => ({
        role: m.role === Role.USER ? 'user' : 'assistant',
        content: m.content,
    }))

    if (messages.length === 0) {
        return {
            content:
                '어서오세요, 단골손님! 오늘 어떤 분위기세요?',
        }
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user')
    return {
        content: lastUser
            ? `「${lastUser.content}」 잘 들었어요. 지금은 데모라 짧게만 답해요, 단골손님. 서버가 붙으면 술·안주 추천도 이어 드릴게요.`
            : '편하게 말씀해 주세요.',
    }
}

/**
 * 바텐더 대화. `messages`가 비어 있으면 오프닝 멘트를 돌려줍니다 (API 스펙은 doc/api.md).
 *
 * `VITE_GEMINI_API_KEY`가 있으면 Gemini(gemini-flash-latest)를 호출합니다. 대화 내용은 호출 측 상태(메모리)에만 있습니다.
 * 키가 없으면 로컬 스텁 응답을 사용합니다.
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
