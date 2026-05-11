import React from 'react';

const SSlabel = ({
    label,
    children
                       }) => {
    return (

        <div
            className={'flex desktop:min-w-[80px] gap-[32px] font-[NotoSansKR-500] text-[16px] text-[#51525c] mb-1'}>
            <p className={'desktop:min-w-[89px]'}>{label}</p>
            { children}
        </div>


    );
};

export default SSlabel;
