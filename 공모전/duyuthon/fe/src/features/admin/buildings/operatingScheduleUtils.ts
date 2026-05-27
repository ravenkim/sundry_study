import i18n from 'src/assets/locales/i18n'

export type OperatingScheduleItem = {
    dayOfWeek: number
    closed: boolean
    powerOnTime?: string
    powerOffTime?: string
}

const DAY_I18N_KEYS: Record<number, string> = {
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
    7: 'sun',
}

export function getDayLabel(dayOfWeek: number): string {
    const key = DAY_I18N_KEYS[dayOfWeek]
    return key ? i18n.t(`adminBuildings:day.${key}`) : String(dayOfWeek)
}

export function defaultOperatingSchedules(): OperatingScheduleItem[] {
    return [1, 2, 3, 4, 5, 6, 7].map((dayOfWeek) => {
        if (dayOfWeek === 7) {
            return { dayOfWeek, closed: true }
        }
        if (dayOfWeek === 6) {
            return {
                dayOfWeek,
                closed: false,
                powerOnTime: '08:00',
                powerOffTime: '18:00',
            }
        }
        return {
            dayOfWeek,
            closed: false,
            powerOnTime: '07:00',
            powerOffTime: '22:00',
        }
    })
}

export function normalizeOperatingSchedules(
    schedules?: OperatingScheduleItem[] | null,
): OperatingScheduleItem[] {
    if (!schedules || schedules.length === 0) {
        return defaultOperatingSchedules()
    }
    const byDay = new Map(schedules.map((s) => [s.dayOfWeek, s]))
    return [1, 2, 3, 4, 5, 6, 7].map(
        (day) => byDay.get(day) ?? { dayOfWeek: day, closed: day === 7 },
    )
}

export function toApiOperatingSchedules(
    schedules: OperatingScheduleItem[],
): OperatingScheduleItem[] {
    return schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        closed: s.closed,
        powerOnTime: s.closed ? undefined : s.powerOnTime,
        powerOffTime: s.closed ? undefined : s.powerOffTime,
    }))
}
