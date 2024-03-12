import React from 'react';
import SSmodal from "../modal/SSmodal.jsx";
import SSCalendar from "./SSCalrendar.jsx";

const SSCalendarWrap = ({calendarVisible,setCalendarVisible}) => {
    const onCancel = () => {
        setCalendarVisible(!calendarVisible)
    }

    const onOk = () => {
        setCalendarVisible(!calendarVisible)
    }
    return (
        <>
            <SSmodal
                title={'예약 일정'}
                visible={calendarVisible}
                onCancel={onCancel}
                onOk={onOk}
                okText={'확인'}
                cancelText={'취소'}
                className={'w-full max-w-[1200px]'}
            >
                <SSCalendar/>
            </SSmodal>
        </>
    );
};

export default SSCalendarWrap;
