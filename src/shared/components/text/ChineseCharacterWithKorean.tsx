import React from 'react';

interface ChineseCharacterWithKoreanProps {
    han?: string;
    kor?: string;
}

const ChineseCharacterWithKorean: React.FC<ChineseCharacterWithKoreanProps> = ({ han, kor }) => {
    const displayKor = kor ?? '없음';

    // 둘 다 없을 때
    if (!han && !kor) {
        return <div className="text-[11px] text-center">({displayKor})</div>;
    }

    return (
        <div className="text-center my-1">
            {han && (
                <div className={kor ? 'text-[11px] text-bold' : 'text-[20px] text-bold'}>
                    {han}
                </div>
            )}
            {kor && <div className="text-[8px]">
                ({displayKor})
            </div>}
        </div>
    );
};

export default ChineseCharacterWithKorean;
