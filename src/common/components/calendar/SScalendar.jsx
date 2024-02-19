import React, {useState, Fragment, useMemo } from 'react';
import {
  Calendar,
  Views,
  DateLocalizer,
  momentLocalizer,
} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';


const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })


const SScalendar = () => {
    moment.locale('ko-KR'); // 시간 국가 설정 // https://github.com/moment/moment/tree/develop/locale
    const localizer = momentLocalizer(moment) // 시간 생성

    const [myEventsList, setMyEventsList] = useState()

    const views = Object.keys(Views).map((k) => Views[k])

    const components = useMemo(() => ({
        components : {
            timeSlotWrapper: ColoredDateCellWrapper,
        }
    }),
    []);

    return (
        <>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                /*view={'month'}*/
                components={components}
                /*resizable
                selectable*/
                showMultiDayTimes
                step={60}
                views={views}

                className={'w-full min-h-[400px] h-auto'} // 스타일 정의
            />
        </>
    );
};

export default SScalendar;


const events = [
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
]
