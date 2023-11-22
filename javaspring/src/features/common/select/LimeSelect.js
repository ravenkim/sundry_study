import React, {useEffect, useState} from 'react';

const LimeSelect = ({value, options, className, placeholder, onChange, }) => {


    const initialValue = {
        value: null,
        targetName: "선택해주세요"
    };

    /**
     * 선택된 값
     */
    const [selectedValue, setSelectedValue] = useState({
        value: null,
        targetName: placeholder ? placeholder : "선택해주세요"
    });

    useEffect(() => {
        if (value) {
            if (value !== selectedValue.value){
                let idx = options.findIndex((item) => item.key === value);

                if (idx > 0) {
                    setSelectedValue((prev) => ({
                        ...prev,
                        value: options[idx].key,
                        targetName: options[idx].value,
                    }));

                }
            }
        }else{
            setSelectedValue((prev) => ({
                ...prev,
                value: initialValue.value,
                targetName: initialValue.targetName,
            }));
        }
    }, [value]);

    /**
     * Selectbox active state
     */
    const [selectActive, setSelectActive] = useState(false);

    /**
     * Selectbox active handler
     */
    const selectClickHandler = () => {
        setSelectActive(!selectActive);
    }

    /**
     * Option ChangeHandler
     * @param target
     * @param targetName
     */
    const optionChangeHandler = (target, targetName) => {

        if (target !== selectedValue.value) {
            setSelectedValue((prev) => ({
                ...prev,
                value: target,
                targetName: targetName,
            }));

            onChange && typeof onChange === "function" && onChange(target);

        }
    }


    return (
        <div className={`select ${className ? className : ""} ${selectActive ? "active" : ""}`}
             onClick={selectClickHandler}>
            <div className="selected">
                <div className="selected-value">{selectedValue.targetName}</div>
            </div>
            <div className="options">
                {options && options.length > 0 ?
                    <ul>

                        {
                            options.map((item, index) => {
                                    return (
                                        <li key={index} className={selectedValue.value === item.key ? "active" : ""}
                                            onClick={() => optionChangeHandler(item.key, item.value)}>{item.value}</li>
                                    )
                                }
                            )
                        }
                    </ul>
                    :
                    <ul>
                        <li>
                            데이터가 없습니다.
                        </li>
                    </ul>
                }
            </div>
        </div>
    );
};

export default LimeSelect;