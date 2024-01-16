import React from 'react';
import {Input} from "antd";
import img_icon_searc_url  from '/src/assets/img/icon_search.svg'

const SSsearchInput = ({

                           title,
                           onSearch,
                           onChange,
                           value,
                           placeholder = "",
                           inputStyle,
                           containerClassName = '',
                            inputClassName = false,
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
                        ...inputStyle,
                    }}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onPressEnter={onSearch}
                    {...inputOtherProps}
                    className={'rounded-[5px] placeholder:text-[16px] px-[22px] text-[16px] text-[#ACACBA] placeholder:text-[#ACACBA] ' + (inputClassName ? ' h-[40px]' : ' h-[60px]')}
                >
                </Input>
                <img
                    onClick={onSearch}
                    src={img_icon_searc_url} alt="#" className={'absolute top-1/2 -translate-y-1/2 right-[22px] ' + (inputClassName ? 'h-[16px]' : '')}/>
            </div>
        </div>
    );
};

export default SSsearchInput;
