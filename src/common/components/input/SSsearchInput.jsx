import React, {useEffect, useState} from 'react';
import {Input} from "antd";

const SSsearchInput = ({

                           title,
                           onPressEnter,
                           onChange,
                           value,
                           placeholder = "",
                           inputStyle,
                           containerStyle,
                           inputOtherProps
                       }) => {

    return (
        <div
            style={{
                marginTop: '40px',
                width: '800px',
                display: "flex",
                flexDirection: "column",
                ...containerStyle
            }}
        >
            <h1 className={title ? 'mb-[20px]' : ''}>
                {title}
            </h1>
            <div className={'relative'}>
                <Input
                    style={{
                        ...inputStyle,
                    }}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onPressEnter={onPressEnter}
                    {...inputOtherProps}
                    className={'h-[60px] rounded-[5px] placeholder:text-[16px] px-[22px] text-[16px] text-[#ACACBA] placeholder:text-[#ACACBA]'}
                >
                </Input>
                <span className={'absolute top-1/2 -translate-y-1/2 right-[22px]'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2375_1229)">
                            <path
                                d="M23.5612 21.4455L18.9161 16.7984C22.3918 12.1536 21.4441 5.57058 16.7993 2.09486C12.1546 -1.38086 5.57156 -0.433144 2.09584 4.21163C-1.37988 8.8564 -0.432167 15.4394 4.21261 18.9151C7.94367 21.7071 13.0682 21.7071 16.7993 18.9151L21.4464 23.5622C22.0304 24.1462 22.9773 24.1462 23.5612 23.5622C24.1452 22.9782 24.1452 22.0314 23.5612 21.4475L23.5612 21.4455ZM10.5447 18.0182C6.41664 18.0182 3.07023 14.6718 3.07023 10.5437C3.07023 6.41566 6.41664 3.06925 10.5447 3.06925C14.6727 3.06925 18.0192 6.41566 18.0192 10.5437C18.0148 14.6699 14.6709 18.0138 10.5447 18.0182Z"
                                fill="#ACACBA"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_2375_1229">
                                <rect width="24" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default SSsearchInput;
