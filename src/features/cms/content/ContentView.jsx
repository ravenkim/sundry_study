import React from 'react';
import SSeditor from "../../../common/components/editor/SSeditor.jsx";
import SSwrapper from "../../../common/components/wrapper/SSwrapper.jsx";
import SSbutton from "../../../common/components/button/SSbutton.jsx";

const ContentView = () => {


    return (
        <div
            style={{
                width: '100%',
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            <div

                className={'w-full '}
                style={{
                    backgroundColor: "rgba(79,95,245,0.9)",
                    display: 'flex',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'center',
                    minHeight: '349px'
                }}

            >
                <div
                    style={{
                        width: '63%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "tomato"
                        }}
                    ></div>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            backgroundColor: "tomato"
                        }}
                    ></div>
                </div>


            </div>

            <div
                style={{
                    width: '63%',
                    minHeight: '500px',
                    backgroundColor: "tomato",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <div
                    style={{
                        width: '58%',
                        backgroundColor: "salmon"
                    }}
                >
                    <SSeditor
                        height={'1000px'}
                        isEditMode={true}
                        changeHandler={(contents) => {
                            console.log(contents)
                        }}
                    />

                </div>

                <div
                    style={{
                        width: '38%',
                        height: '500px',
                        display: "flex",
                        flexDirection: 'column'
                    }}
                >


                    <SSwrapper
                        style={{
                            width: '100%',
                            alignItems: 'center'

                        }}
                    >
                        대여 버튼

                    </SSwrapper>


                    <div
                        style={{marginTop: '20px'}}
                    >
                        <SSbutton> 수정 </SSbutton>
                        <SSbutton> 삭제 </SSbutton>
                    </div>


                </div>


            </div>
        </div>

    );
};

export default ContentView;
