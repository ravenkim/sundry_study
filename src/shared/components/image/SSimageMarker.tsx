import React from 'react'

interface Marker {
    position: { x: number; y: number }
    size: { x: number; y: number }
    component: React.ReactNode
}

interface ImageMarkerProps {
    src: string
    imageWidth: number // 원본 이미지 width(px)
    markers: Marker[]
    className?: string
}

export default function SSimageMarker({
    src,
    imageWidth,
    markers,
    className,
}: ImageMarkerProps) {
    return (
        <div className={`relative inline-block w-full ${className || ''}`}>
            <img src={src} alt="base" className="block h-auto w-full" />
            {markers?.map((marker, i) => {
                const widthPercent = (marker.size.x / imageWidth) * 100

                return (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${marker.position.x}%`,
                            top: `${marker.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `${widthPercent}%`, // 부모(relative) 기준 너비
                        }}
                    >
                        <div
                            className="flex w-full items-center justify-center"
                            style={{
                                aspectRatio: `${marker.size.x} / ${marker.size.y}`,
                            }}
                        >
                            {marker.component}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
