import React, {useRef, useState} from 'react';
import Calendar from '@toast-ui/react-calendar';
import '@toast-ui/calendar/dist/toastui-calendar.css';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';

const SSCalendar = () => {
    const calendarRef = useRef(null);

    const [events, setEvents] = useState([ // 예약목록 -- 나중에 데이터 리덕스로 불러오기로 변경
        {
            id: '1',
            calendarId: '1',
            title: 'All Day Event very long title',
            category: 'time',
            start: new Date('2024-01-01T09:00:00'),
            end: new Date('2024-01-01T11:00:00'),
            // monthIndex는 0부터 1월
            // end date는 -1값이 실제 표시값
        },
        {
            id: '2',
            calendarId: '1',
            title: 'Long Event',
            start: new Date('2024-02-01T09:00:00'),
            end: new Date('2024-02-16T11:00:00'),
        },

        {
            id: '3',
            calendarId: '1',
            title: 'DTS STARTS',
            start: new Date('2024-03-01T09:00:00'),
            end: new Date('2024-03-04T11:00:00'),
        },

        {
            id: '4',
            calendarId: '1',
            title: 'DTS ENDS',
            start: new Date('2024-03-07T09:00:00'),
            end: new Date('2024-03-12T11:00:00'),
        },

        {
            id: '5',
            calendarId: '1',
            title: 'Some Event',
            start: new Date('2024-04-01T09:00:00'),
            end: new Date('2024-04-02T11:00:00'),
        },
        {
            id: '6',
            calendarId: '1',
            title: 'Conference',
            start: new Date('2024-04-12T09:00:00'),
            end: new Date('2024-04-13T11:00:00'),
            desc: 'Big conference for important people'
        },
        {
            id: '7',
            calendarId: '1',
            title: 'Meeting',
            start: new Date('2024-04-20T09:00:00'),
            end: new Date('2024-04-20T11:00:00'),
            desc: 'Pre-meeting meeting, to prepare for the meeting'
        },
        {
            id: '8',
            calendarId: '1',
            title: 'Lunch',
            start: new Date('2024-05-08T09:00:00'),
            end: new Date('2024-05-12T11:00:00'),
            desc: 'Power lunch'
        }
    ]);

    const moveToToday = () => {
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.today();
    };

    const moveToDate = (direction) => {
        const calendarInstance = calendarRef.current.getInstance();
        if (direction === 'next') calendarInstance.next();
        else if (direction === 'prev') calendarInstance.prev();
    };

    // 이벤트 생성 후 콜백 함수
    const onBeforeCreateSchedule = (scheduleData) => {
        const {start, end, title} = scheduleData;
        const newEvent = {
            id: String(Math.random()), // 실제 애플리케이션에서는 더 견고한 방법으로 ID를 생성해야 합니다.
            calendarId: '1', // 해당 캘린더 id는 calendars 속성과 같아야 한다. contentId로 구분한다.
            title: title,
            isAllDay: true,
            category: 'time',
            start: new Date(start.toDate()),
            end: new Date(end.toDate()),
        };

        // 새 이벤트를 이벤트 리스트에 추가
        setEvents(prevEvents => [...prevEvents, newEvent]);

        // 캘린더 인스턴스에 새 스케줄을 추가
        const calendarInstance = calendarRef.current.getInstance();
        calendarInstance.createEvents([newEvent]);
    };

    return (
        <>
            <div>
                <button onClick={() => moveToDate('prev')}>지난 달</button>
                <button onClick={moveToToday}>오늘</button>
                <button onClick={() => moveToDate('next')}>다음 달</button>
            </div>
            <Calendar
                ref={calendarRef}
                events={events}
                height="600px"
                calendars={[ // 해당 캘린더 id는 calendars 속성과 같아야 한다. contentId로 구분한다.
                    {
                        id: '1',
                        name: 'Primary Calendar', // 캘린더의 이름 - 해당 contentId의 이름으로 바꾼다.
                        bgColor: '#9e5fff',
                        borderColor: '#9e5fff',
                    }
                ]}
                view="month" // 달력 뷰 모드 설정: 'day', 'week', 'month'
                useDetailPopup={true} // 이벤트 상세 정보 팝업 사용 설정
                useFormPopup={true} // 이벤트 상세 정보 팝업 사용 설정
                onBeforeCreateSchedule={onBeforeCreateSchedule} // 새 이벤트 생성 전 호출되는 콜백 함수
                usageStatistics={false} // GA 수집 허락 여부
            />
        </>
    );
};

export default SSCalendar;
