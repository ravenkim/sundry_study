import React, {useEffect, useState} from 'react';
import {Input} from "antd";

const SSsearchInput = ({

                           title,
                           onPressEnter,
                           onChange,
                           value,
                           placeholder = "",
                           inputStyle,
                           containerClassName = '',
                            inputClassName,
                            iconClassName,
                            svgWidth,
                           inputOtherProps,

                       }) => {

    return (
        <div
            className={`
                mt-10  
                flex 
                flex-col 
                w-full 
                ${containerClassName}
            `}
        >
            <h1 className={title ? 'mb-[20px]' : ''}>
                {title}
            </h1>
            <div className={'relative'}>
                <Input
                    style={{
                        height:'60px',
                        ...inputStyle,
                    }}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onPressEnter={onPressEnter}
                    {...inputOtherProps}
                    className={'rounded-[5px] placeholder:text-[16px] px-[22px] text-[16px] text-[#ACACBA] placeholder:text-[#ACACBA] ' + inputClassName}
                >
                </Input>
                <img src="/src/assets/img/icon_search.svg" alt="#" className={'absolute top-1/2 -translate-y-1/2 right-[22px]'}/>
            </div>
        </div>
    );
};

export default SSsearchInput;
