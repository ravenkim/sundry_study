import React from 'react';

interface ChineseCharacterWithKoreanProps {
    han?: string;
    kor?: string;
}

const ChineseCharacterWithKorean: React.FC<ChineseCharacterWithKoreanProps> = ({ han, kor }) => {
    const displayKor = kor ?? '없음';

    // 둘 다 없을 때
    if (!han && !kor) {
        return <div className="text-[12px] text-center">({displayKor})</div>;
    }

    return (
        <div className="text-center">
            {han && (
                <div className={kor ? 'text-[16px]' : 'text-[20px]'}>
                    {han}
                </div>
            )}
            <div className="text-[12px]">
                ({displayKor})
            </div>
        </div>
    );
};

export default ChineseCharacterWithKorean;
