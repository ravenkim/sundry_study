import coffeeImg from 'src/assets/rewards/coffee.svg'
import convenienceImg from 'src/assets/rewards/convenience.svg'
import donationImg from 'src/assets/rewards/donation.svg'
import giftImg from 'src/assets/rewards/gift.svg'
import mealImg from 'src/assets/rewards/meal.svg'
import type { RewardItem } from 'src/globals/api/types'

const BY_KEY: Record<string, string> = {
    coffee: coffeeImg,
    convenience: convenienceImg,
    meal: mealImg,
    donation: donationImg,
    gift: giftImg,
}

export type RewardCategoryKey = 'coffee' | 'convenience' | 'donation'

/** Canonical API category labels (matches BE / mock data). */
export const REWARD_CATEGORY_API_VALUES: Record<RewardCategoryKey, string> = {
    coffee: '커피/음료',
    convenience: '편의점',
    donation: '환경 기부',
}

const BY_CATEGORY_KEY: Record<RewardCategoryKey, string> = {
    coffee: coffeeImg,
    convenience: convenienceImg,
    donation: donationImg,
}

const API_VALUE_TO_CATEGORY_KEY: Record<string, RewardCategoryKey> =
    Object.fromEntries(
        Object.entries(REWARD_CATEGORY_API_VALUES).map(([key, value]) => [
            value,
            key as RewardCategoryKey,
        ]),
    ) as Record<string, RewardCategoryKey>

export function resolveRewardCategoryKey(
    category: string,
): RewardCategoryKey | undefined {
    return API_VALUE_TO_CATEGORY_KEY[category]
}

export const DEFAULT_REWARD_IMAGE = giftImg

export function resolveRewardImageSrc(
    item: Pick<RewardItem, 'category' | 'imageUrl' | 'imageKey' | 'name'>,
): string {
    if (item.imageKey && BY_KEY[item.imageKey]) {
        return BY_KEY[item.imageKey]
    }
    if (item.name.includes('학식')) {
        return mealImg
    }
    const categoryKey = resolveRewardCategoryKey(item.category)
    if (categoryKey && BY_CATEGORY_KEY[categoryKey]) {
        return BY_CATEGORY_KEY[categoryKey]
    }
    return DEFAULT_REWARD_IMAGE
}
