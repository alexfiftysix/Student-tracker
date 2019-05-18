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
    // TODO: Don't add a day - just for testing
    let current_date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    console.log(current_date);
    let dates = get_all_days_in_week(current_date);

    return (
        <div className={'weekly-view'}>
            {dates.map(d =>
            <DailyView key={d} date={d}/>
            )}
        </div>
    )
}

export default WeeklyView