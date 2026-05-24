import { delay } from 'src/globals/api/apiUtils'
import type { AiReportResult, CreateReportPayload } from 'src/globals/api/types'
import { updateMockPointsAfterReport } from 'src/globals/api/mock/data'

const AI_MESSAGES: Record<AiReportResult['result'], string> = {
    WASTE_DETECTED: '빈 강의실에서 에너지 낭비가 발견되었습니다!',
    PASS: '강의실에 사람이 있습니다. 정상 상태입니다.',
    ERROR: '강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)',
}

export async function simulateAiAnalysis(
    payload: CreateReportPayload,
): Promise<AiReportResult> {
    await delay(3000 + Math.random() * 2000)

    const fileName = payload.image.name.toLowerCase()
    let result: AiReportResult['result'] = 'WASTE_DETECTED'

    if (fileName.includes('error') || fileName.includes('fail')) {
        result = 'ERROR'
    } else if (fileName.includes('pass') || fileName.includes('normal')) {
        result = 'PASS'
    }

    const pointAwarded =
        result === 'WASTE_DETECTED' ? 50 + Math.floor(Math.random() * 50) : 0
    const points = updateMockPointsAfterReport(pointAwarded)

    return {
        result,
        message: AI_MESSAGES[result],
        ac_status: result === 'WASTE_DETECTED' ? 'ON' : 'OFF',
        light_status: result === 'WASTE_DETECTED' ? 'ON' : 'OFF',
        reason:
            result === 'WASTE_DETECTED'
                ? 'Ceiling lights are visibly illuminated in an empty classroom.'
                : undefined,
        expected: result === 'WASTE_DETECTED' ? `${pointAwarded * 5}원` : '0원',
        expectedKwh: result === 'WASTE_DETECTED' ? '3.8 kWh' : '0 kWh',
        pointAwarded,
        currentBalance: points.currentBalance,
    }
}
