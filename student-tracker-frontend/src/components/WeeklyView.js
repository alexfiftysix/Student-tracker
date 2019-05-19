import React from 'react'
import DailyView from './DailyView'
import './WeeklyView.css'

// TODO: server-optimise this to use the /my_appointments/weekly endpoint

function get_next_seven_days() {
    let date = new Date(Date());

    let weekdays = [];
    for (let i = 0; i < 7; i++) {
        let current = new Date();
        current.setDate(date.getDate() + i);

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
    const dates = get_next_seven_days();

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
