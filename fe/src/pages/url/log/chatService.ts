// import { client } from 'src/globals/api/client.tsx'
import { Role, type Recommendation } from 'src/pages/url/log/types.ts'

type ApiChatMessage = { role: 'user' | 'assistant'; content: string }

export type ChatTurnResult = {
    content: string
    recommendation?: Recommendation
    safetyCutoffSuggested?: boolean
}

/**
 * 바텐더 대화. `messages`가 비어 있으면 오프닝 멘트를 돌려줍니다 (API 스펙은 doc/api.md).
 *
 * 서버 미구동: `POST /api/chat` 호출은 주석 처리. 연동 시 주석 해제하고 로컬 스텁 분기를 제거하세요.
 */
export async function chatWithJun(
    history: { role: Role; content: string }[],
): Promise<ChatTurnResult> {
    const messages: ApiChatMessage[] = history.map((m) => ({
        role: m.role === Role.USER ? 'user' : 'assistant',
        content: m.content,
    }))

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
