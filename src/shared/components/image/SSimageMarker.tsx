import React from 'react';
import Image from 'next/image';
import SSresizableTextBox from '@/shared/components/text/SSresizableTextBox'

interface Marker {
    position: { x: number; y: number };
    size: { x: number; y: number };
    text: string;
}

interface ImageMarkerProps {
    src: string;
    imageWidth: number;  // 원본 이미지 width(px)
    markers: Marker[];
    className?: string;
}

export default function SSimageMarker({
                                          src,
                                          imageWidth,
                                          markers,
                                          className,
                                      }: ImageMarkerProps) {
    return (
        <div className={`relative w-full inline-block ${className || ''}`}>
            <Image src={src} alt="base" className="block w-full h-auto" />
            {markers?.map((marker, i) => {
                const widthPercent = (marker.size.x / imageWidth) * 100;

                return (
                    <div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${marker.position.x}%`,
                            top: `${marker.position.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: `${widthPercent}%`,  // 부모(relative) 기준 너비
                        }}
                    >
                        <div
                            className="flex items-center justify-center bg-red-500 w-full"
                            style={{
                                aspectRatio: `${marker.size.x} / ${marker.size.y}`,
                            }}
                        >
                            <SSresizableTextBox maxFontSize={200}>
                                {marker.text}
                            </SSresizableTextBox>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}