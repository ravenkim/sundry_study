import React, { type Dispatch, type SetStateAction } from 'react'
import { ScrollArea } from './ScrollArea.tsx'
import { BACKGROUNDS } from '../constants/backgrounds.tsx'

interface SelectBgProps {
    setBg: Dispatch<SetStateAction<string>>
}

const BgPreview: React.FC<{ bgId: string }> = ({ bgId }) => {
    const background = BACKGROUNDS.find((b) => b.id === bgId)
    return <>{background?.component}</>
}

const SelectBg: React.FC<SelectBgProps> = ({ setBg }) => {
    return (
        <div className="h-full w-full p-4">
            <ScrollArea className="h-full w-full">
                <div className="grid grid-cols-2 gap-4">
                    {BACKGROUNDS.map((bg) => (
                        <div
                            key={bg.id}
                            onClick={() => setBg(bg.id)}
                            className="group cursor-pointer overflow-hidden rounded-lg border-2 border-transparent transition-all hover:border-blue-500"
                        >
                            <div className="h-24 w-full">
                                <BgPreview bgId={bg.id} />
                            </div>
                            <div className="bg-gray-800 p-2 text-center text-sm text-white transition-all group-hover:bg-blue-500">
                                {bg.name}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default SelectBg
