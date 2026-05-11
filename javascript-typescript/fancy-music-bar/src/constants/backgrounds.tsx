import React from 'react'
import Prism from '../bg/Prism.tsx'
import Hyperspeed from '../bg/hyperspeed/Hyperspeed.tsx'
import Silk from '../bg/Silk.tsx'
import { hyperspeedPresets } from '../bg/hyperspeed/hyperspeedPresets.ts'

export interface Background {
    id: string
    name: string
    component: React.ReactNode
}

export const BACKGROUNDS: Background[] = [
    {
        id: 'off',
        name: 'Off',
        component: <div className="h-full w-full bg-gray-900" />,
    },
    {
        id: 'prism',
        name: 'Prism',
        component: (
            <Prism
                animationType="rotate"
                timeScale={0.5}
                height={8}
                baseWidth={8}
                scale={2}
                hueShift={0}
                colorFrequency={1}
                noise={0}
                glow={1}
            />
        ),
    },
    {
        id: 'hyperspeed',
        name: 'Hyperspeed',
        component: (
            <div className="relative h-full w-full overflow-hidden bg-black">
                <Hyperspeed effectOptions={hyperspeedPresets.one} />
            </div>
        ),
    },

    {
        id: 'silk',
        name: 'Silk',
        component: (
            <div className="relative h-full w-full overflow-hidden bg-black">
                <Silk
                    speed={5}
                    scale={1}
                    color="#7B7481"
                    noiseIntensity={1.5}
                    rotation={0}
                />
            </div>
        ),
    },
]
