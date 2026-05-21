import angerWebp from 'src/assets/mascort/anger.webp'
import contemptWebp from 'src/assets/mascort/contempt.webp'
import nomalWebp from 'src/assets/mascort/nomal.webp'
import questionWebp from 'src/assets/mascort/question.webp'
import recognizeWebp from 'src/assets/mascort/recognize.webp'
import sadWebp from 'src/assets/mascort/sad.webp'
import sleepyWebp from 'src/assets/mascort/sleepy.webp'
import smileWebp from 'src/assets/mascort/smile.webp'

export type MascortEmotion =
    | 'smile'
    | 'nomal'
    | 'recognize'
    | 'question'
    | 'sleepy'
    | 'sad'
    | 'anger'
    | 'contempt'

export type MascortEmotionAlias = MascortEmotion | 'normal'

export const MASCORT_SRC: Record<MascortEmotion, string> = {
    smile: smileWebp,
    nomal: nomalWebp,
    recognize: recognizeWebp,
    question: questionWebp,
    sleepy: sleepyWebp,
    sad: sadWebp,
    anger: angerWebp,
    contempt: contemptWebp,
}

export const MASCORT_ALT: Record<MascortEmotion, string> = {
    smile: '기쁜 에코 마스코트',
    nomal: '에코 마스코트',
    recognize: '낭비를 확인하는 에코 마스코트',
    question: '궁금해하는 에코 마스코트',
    sleepy: '검토 중인 에코 마스코트',
    sad: '아쉬워하는 에코 마스코트',
    anger: '화난 에코 마스코트',
    contempt: '심각한 낭비를 보는 에코 마스코트',
}

export function resolveMascortEmotion(
    emotion: MascortEmotion | 'normal',
): MascortEmotion {
    return emotion === 'normal' ? 'nomal' : emotion
}
