import React from 'react'

interface ChineseCharacterWithKoreanProps {
    han?: string
    kor?: string
}

const ChineseCharacterWithKorean: React.FC<ChineseCharacterWithKoreanProps> = ({
    han,
    kor,
}) => {
    const displayKor = kor ?? '없음'

    // 둘 다 없을 때
    if (!han && !kor) {
        return <div className="text-center text-[11px]">({displayKor})</div>
    }

    return (
        <div className="my-1 text-center">
            {han && (
                <div
                    className={
                        kor ? 'text-bold text-[11px]' : 'text-bold text-[20px]'
                    }
                >
                    {han}
                </div>
            )}
            {kor && <div className="text-[8px]">({displayKor})</div>}
        </div>
    )
}

export default ChineseCharacterWithKorean
