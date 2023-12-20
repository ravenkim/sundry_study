import React from 'react';

const SSlabelForInput = ({
    label,
    children
                       }) => {
    return (
         <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: '10px'
            }}
        >

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: '100px',
                    alignItems: "center"
                }}
            >

                <h4>
                    {label}:
                </h4>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: '100%',
                    alignItems: "center"
                }}
            >
                {children}

            </div>


        </div>
    );
};

export default SSlabelForInput;
