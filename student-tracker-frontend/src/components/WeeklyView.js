import React from 'react'
import DailyView from './DailyView'
import './WeeklyView.css'


function get_all_days_in_week(day) {
    let date = new Date(Date.parse(day));
    let sunday = new Date();
    sunday.setDate(new Date(date).getDate() - new Date(date).getDay());

    let weekdays = [];
    for (let i = 0; i < 7; i++) {
        let current = new Date();
        current.setDate(sunday.getDate() + i);

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

function WeeklyView() {
    let date = '2019-05-14';
    let datedate = Date(date);
    let dates = get_all_days_in_week(datedate);

    return (
        <div className={'weekly-view'}>
            {dates.map(d =>
            <DailyView date={d}/>
            )}
        </div>
    )
}

export default WeeklyView