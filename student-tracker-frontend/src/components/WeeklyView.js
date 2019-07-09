import React from 'react'
import DailyView from './DailyView'
import './WeeklyView.css'

// TODO: server-optimise this to use the /my_appointments/weekly endpoint

function get_next_seven_days(start_date) {
    let date = new Date(Date.parse(start_date));

    let weekdays = [];
    for (let i = 0; i < 7; i++) {
        let current = new Date(date.getTime() + i * 24 * 60 * 60 * 1000);

        let year = current.getFullYear();
        let month = String(current.getMonth() + 1);
        if (month.length === 1) {
            month = '0' + month;
        }

        let day = String(current.getDate());
        if (day.length === 1) {
            day = '0' + day;
        }

        weekdays.push('' + year + '-' + month + '-' + day);
    }

    return weekdays;
}

export default function WeeklyView(props) {
    let start_date = props.start_date || props.match.params.start_date;
    const dates = get_next_seven_days(start_date);

    if (!dates) {
        return (
            <div className={'weekly-view'}>Loading...</div>
        );
    }

    return (
        <div className={'weekly-view'}>
            {dates.map(d =>
                <DailyView key={d} date={d}/>
            )}
        </div>
    );
}
