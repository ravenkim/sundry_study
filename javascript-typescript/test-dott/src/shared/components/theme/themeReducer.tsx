import { reduxMaker } from 'src/app/store/redux/reduxUtils.ts'
import { PayloadAction } from '@reduxjs/toolkit'
import { colorGroups } from 'src/shared/components/theme/colorConstants.tsx'

const prefix = 'theme'

const asyncRequests = [] as const

const localState = {
    colors: {} as Record<string, string>,
}

const localReducers = {
    setColors: (state: typeof localState) => {
        const keys = colorGroups.flatMap((g) => g.keys)
        const styles = getComputedStyle(document.documentElement)
        state.colors = Object.fromEntries(
            keys.map((key) => [key, styles.getPropertyValue(key).trim()]),
        )
    },
    setColor: (
        state: typeof localState,
        action: PayloadAction<{ key: string; value: string }>,
    ) => {
        state.colors[action.payload.key] = action.payload.value
    },
}

const module = reduxMaker(prefix, asyncRequests, localState, localReducers)
export const {
    slice: themeSlice,
    actions: themeAction,
    saga: themeSaga,
} = module
