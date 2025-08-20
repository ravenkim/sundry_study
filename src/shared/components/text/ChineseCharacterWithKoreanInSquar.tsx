const ChineseCharacterWithKoreanInSquare = ({
                                                backgroundColor = '#f0f0f0',
                                                koreanChar = '산',
                                                mainChineseChar = '山',
                                                subChineseChars = '高峰'
                                            }) => {
    // 배경색의 밝기를 계산하여 텍스트 색상 결정
    const getTextColor = (bgColor: string ) => {
        // hex 색상을 RGB로 변환
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // 밝기 계산 (0-255)
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // 밝기가 128보다 크면 검정색, 아니면 흰색
        return brightness > 128 ? '#000000' : '#ffffff';
    };

    const textColor = getTextColor(backgroundColor);

    return (
        <div
            className=" flex flex-col items-center justify-center  rounded-lg shadow-lg py-2 px-3 mb-1"
            style={{
                backgroundColor: backgroundColor,
                color: textColor
            }}
        >
            {/* 위쪽 한글 */}
            <div
                className="text-xs "
                style={{ color: textColor }}
            >
                {koreanChar}
            </div>

            {/* 가운데 메인 한자 */}
            <div
                className="text-2xl font-bold"
                style={{
                    color: textColor,
                    fontFamily: 'serif'
                }}
            >
                {mainChineseChar}
            </div>

            {/* 아래쪽 서브 한자들 */}
            <div
                className=" text-xs font-medium tracking-wider"
                style={{
                    color: textColor,
                    fontFamily: 'serif'
                }}
            >
                {subChineseChars}
            </div>
        </div>
    );
};


export default ChineseCharacterWithKoreanInSquare