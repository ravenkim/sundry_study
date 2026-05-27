import { useState } from 'react'
import { cn } from 'src/shared/lib/shadcn/lib/utils'
import type { RewardItem } from 'src/globals/api/types'
import {
    DEFAULT_REWARD_IMAGE,
    resolveRewardImageSrc,
} from 'src/features/user/rewardAssets'

type RewardImageProps = {
    item: Pick<RewardItem, 'category' | 'imageUrl' | 'imageKey' | 'name'>
    className?: string
    imgClassName?: string
}

export function RewardImage({
    item,
    className,
    imgClassName,
}: RewardImageProps) {
    const fallbackSrc = resolveRewardImageSrc(item)
    const [src, setSrc] = useState(item.imageUrl || fallbackSrc)

    return (
        <div
            className={cn(
                'bg-surface-container-low flex h-full w-full items-center justify-center',
                className,
            )}
        >
            <img
                src={src}
                alt={item.name}
                className={cn('h-full w-full object-cover', imgClassName)}
                loading="lazy"
                onError={() => {
                    if (src !== fallbackSrc) {
                        setSrc(fallbackSrc)
                        return
                    }
                    if (src !== DEFAULT_REWARD_IMAGE) {
                        setSrc(DEFAULT_REWARD_IMAGE)
                    }
                }}
            />
        </div>
    )
}
