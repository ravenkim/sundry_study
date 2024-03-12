import React, {useState, Fragment, useMemo} from 'react';
import {
    Calendar,
    Views,
    DateLocalizer,
    momentLocalizer,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SSbutton from "../button/SSbutton.jsx";
import {DatePicker, message, Space} from "antd";


const ColoredDateCellWrapper = ({children}) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'black',
        },
    })


const Toolbar = (props) => {
    const {date} = props;

    const navigate = (action) => {
        props.onNavigate(action);
    };
    return (
        <div className="rbc-toolbar">
          <span className="rbc-btn-group relative w-full flex justify-center items-center">
              <div>

                  <SSbutton onClick={navigate.bind(null, 'PREV')}>이전</SSbutton>
                  <span className="rbc-toolbar-label">{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</span>
                  <SSbutton onClick={navigate.bind(null, 'NEXT')}>다음</SSbutton>
              </div>
              <div className={'absolute left-0 top-0'}>
                  <SSbutton onClick={navigate.bind(null, 'TODAY')}>오늘로 돌아가기</SSbutton>
              </div>

          </span>
        </div>
    )
}

const SSCalendar = () => {

    const [events,setEvents] = useState([ // 예약목록 -- 나중에 데이터 리덕스로 불러오기로 변경
    {
        'title': 'All Day Event very long title',
        'allDay': true,
        'start': new Date(2024, 1, 1), // monthIndex는 0부터 1월
        'end': new Date(2024, 1, 10) // end date는 -1값이 실제 표시값
    },
    {
        'title': 'Long Event',
        'start': new Date(2024, 1, 7),
        'end': new Date(2024, 1, 10)
    },

    {
        'title': 'DTS STARTS',
        'start': new Date(2024, 1, 13, 0, 0, 0),
        'end': new Date(2024, 1, 20, 0, 0, 0)
    },

    {
        'title': 'DTS ENDS',
        'start': new Date(2024, 1, 6, 0, 0, 0),
        'end': new Date(2024, 1, 13, 0, 0, 0)
    },

    {
        'title': 'Some Event',
        'start': new Date(2024, 1, 9, 0, 0, 0),
        'end': new Date(2024, 1, 9, 0, 0, 0)
    },
    {
        'title': 'Conference',
        'start': new Date(2024, 3, 11),
        'end': new Date(2024, 3, 13),
        desc: 'Big conference for important people'
    },
    {
        'title': 'Meeting',
        'start': new Date(2024, 3, 12, 10, 30, 0, 0),
        'end': new Date(2024, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
        'title': 'Lunch',
        'start': new Date(2024, 3, 12, 12, 0, 0, 0),
        'end': new Date(2024, 3, 12, 13, 0, 0, 0),
        desc: 'Power lunch'
    },
    {
        'title': 'Meeting',
        'start': new Date(2024, 3, 12, 14, 0, 0, 0),
        'end': new Date(2024, 3, 12, 15, 0, 0, 0)
    },
    {
        'title': 'Happy Hour',
        'start': new Date(2024, 2, 12, 17, 0, 0, 0),
        'end': new Date(2024, 2, 12, 17, 30, 0, 0),
        desc: 'Most important meal of the day'
    },
    {
        'title': 'Dinner',
        'start': new Date(2024, 3, 12, 20, 0, 0, 0),
        'end': new Date(2024, 3, 12, 21, 0, 0, 0)
    },
    {
        'title': 'Birthday Party',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Birthday Party 2',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Birthday Party 3',
        'start': new Date(2015, 3, 13, 7, 0, 0),
        'end': new Date(2015, 3, 13, 10, 30, 0)
    },
    {
        'title': 'Late Night Event',
        'start': new Date(2015, 3, 17, 19, 30, 0),
        'end': new Date(2015, 3, 18, 2, 0, 0)
    },
    {
        'title': 'Multi-day Event',
        'start': new Date(2015, 3, 20, 19, 30, 0),
        'end': new Date(2015, 3, 22, 2, 0, 0)
    }
]);


    moment.locale('ko-KR'); // 시간 국가 설정 // https://github.com/moment/moment/tree/develop/locale
    const localizer = momentLocalizer(moment) // 시간 생성
    // const views = Object.keys(Views).map((k) => Views[k]) // 상단 버튼바 기본 설정 - 모든 버튼이 나오게 하기

    const [isModalVisible, setIsModalVisible] = useState(false); // 예약객체 나타나게 하기
    const [selectedRange, setSelectedRange] = useState({ start: null, end: null }); // 날짜 선택하기

    const components = useMemo(() => ({
            components: {
                timeSlotWrapper: ColoredDateCellWrapper,
            },
            toolbar: Toolbar
        }),
        []);


    // 날짜 겹침 확인 함수
    const isOverlap = (newStart, newEnd) => {
        return events.some(event => {
            return (
                (moment(newStart).isSameOrBefore(moment(event.end)) && moment(newEnd).isSameOrAfter(moment(event.start)))
            );
        });
    };

    const handleOk = () => {
        if (isOverlap(selectedRange.start, selectedRange.end)) {
            // 겹치는 경우 경고 메시지 표시
            message.error('예약하고자 하는 날짜는 이미 예약중입니다. 다시 선택해주세요.'); // 경고 메시지 얼러트로 변경하기
        } else {
            // 겹치지 않는 경우 예약 진행
            const newEvent = {
                title: 'New Event',
                start: selectedRange.start,
                end: selectedRange.end,
                allDay: false
            };
            setEvents((currentEvents) => [...currentEvents, newEvent]);
            setIsModalVisible(false);
            // 성공 메시지 추가하기
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        setSelectedRange({ start, end });
        setIsModalVisible(true);
    };

    return (
        <>
            <div className={'flex justify-start items-start gap-[20px]'}>
                <Calendar
                    localizer={localizer}
                    events={events} // 달력에 이미 예약되어 있는 날 표시
                    startAccessor="start"
                    endAccessor="end"
                    components={components}
                    selectable // 날짜 클릭 가능
                    showMultiDayTimes
                    step={60}
                    views={{
                        /*day: true, */
                        month: true
                    }}
                    onSelectSlot={handleSelectSlot} // 달력의 빈 곳을 클릭하면 실행 -- 새로운 예약 생성하기

                    className={'w-full min-h-[500px] h-auto'} // 스타일 정의
                />
                <div className={'flex flex-col transition-all overflow-hidden ' + (isModalVisible ? 'w-auto h-fit' : 'w-0 h-0')}>
                    <div className={'flex flex-col'}>
                        <p>예약 날짜를 지정해주세요.</p>
                        <span>예약이 완료되면 알림으로 알려드려요. 꼭 시간 내에 반납해주세요.</span>
                        <span>언제든지 취소할 수 있어요, 예약목록에서 확인해주세요.</span>
                        <span>문의사항이 있으면 언제든지 알려주세요. 최대한 빠르게 확인할게요! :)</span>
                    </div>
                    <div>
                    <Space>
                        <DatePicker.RangePicker
                            format={"YYYY-MM-DD"}
                            onChange={(dates, dateStrings)=>{
                                setSelectedRange({
                                    start:dates ? dates[0].toDate() : null,
                                    end: dates ? dates[1].toDate() : null
                                })
                            }}
                        />
                    </Space>
                    <SSbutton onClick={handleOk}>예약하기</SSbutton>
                    <SSbutton onClick={()=>{
                        setIsModalVisible(false)
                        // 닫기 누른 후 데이트피커 value 값 초기화하기
                    }}>돌아가기</SSbutton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SSCalendar;

