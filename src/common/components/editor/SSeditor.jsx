import React from 'react';
import {LIME_EDITOR_OPTIONS} from "./EditorConstants.js";
import SunEditor from 'suneditor-react';



const SSeditor = ({height = "500px", autoFocus, isEditMode, initContents, changeHandler, customOptions}) => {
    return (
        <SunEditor
            lang={ko}
            autoFocus={autoFocus}
            disable={!isEditMode}
            hideToolbar={!isEditMode}
            setContents={initContents}
            height={height}
            setDefaultStyle={`font-family: 'Malgun Gothic'; font-size: 14px;`}
            onChange={(contents) => {
                if(changeHandler && typeof changeHandler === "function"){
                    changeHandler(contents);
                }
            }}
            setOptions={{
                ...LIME_EDITOR_OPTIONS,
                ...customOptions,
            }}
          />
    );
};

export default SSeditor;
