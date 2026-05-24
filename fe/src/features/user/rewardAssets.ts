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

const BY_CATEGORY: Record<string, string> = {
    '커피/음료': coffeeImg,
    '편의점': convenienceImg,
    '환경 기부': donationImg,
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
    if (BY_CATEGORY[item.category]) {
        return BY_CATEGORY[item.category]
    }
    return DEFAULT_REWARD_IMAGE
}
