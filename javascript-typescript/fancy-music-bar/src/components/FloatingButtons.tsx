import type { Dispatch, SetStateAction } from 'react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Fullscreen, Monitor, Pencil } from 'lucide-react'
import DrawerButton from './DrawerButton'
import SelectBg from './SelectBg.tsx'
import SelectText from './SelectText.tsx'

interface FloatingButtonsProps {
    setBg: Dispatch<SetStateAction<string>>
}

const FloatingButtons: React.FC<FloatingButtonsProps> = ({ setBg }) => {
    const [showButtons, setShowButtons] = useState(false)
    const timeoutRef = useRef<number | null>(null)

    const handleMouseMove = useCallback(() => {
        setShowButtons(true)
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = window.setTimeout(
            () => setShowButtons(false),
            1000,
        )
    }, [])

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [handleMouseMove])

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(
                    `Error attempting to enable full-screen mode: ${err.message}`,
                )
            })
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err) => {
                    console.error(
                        `Error attempting to exit full-screen mode: ${err.message}`,
                    )
                })
            }
        }
    }, [])

    return (
        <div
            className={`fixed right-5 bottom-5 flex flex-col gap-2 ${
                showButtons ? 'flex' : 'hidden'
            }`}
        >
            <button
                onClick={toggleFullscreen}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 shadow-md"
            >
                <Fullscreen color="white" size={24} />
            </button>

            {/*추후 음악 기능 업데이트 */}
            {/*<DrawerButton*/}
            {/*  icon={<Music color="white" size={24} />}*/}
            {/*  drawerContent={<div>Music Drawer Content</div>}*/}
            {/*/>*/}

            <DrawerButton
                title={'글자'}
                description={'원하는 글자를 선택하세요'}
                icon={<Pencil color="white" size={24} />}
                drawerContent={<SelectText />}
            />

            <DrawerButton
                title={'배경선택'}
                description={'원하는 배경을 선택하세요'}
                icon={<Monitor color="white" size={24} />}
                drawerContent={<SelectBg setBg={setBg} />}
            />
        </div>
    )
}

export default FloatingButtons
