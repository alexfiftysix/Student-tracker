import React from 'react'
import {Link} from "react-router-dom";
import WeeklyView from './WeeklyView'
import './weekNavigator.css'

export default function WeekNavigator(props) {
    const start_date = props.match.params.start_date;
    const as_date = new Date(start_date);

    let next_week = new Date(as_date.getTime() + 7 * 24 * 60 * 60 * 1000);
    next_week = next_week.getFullYear() + '-' + ('0' + (1 + next_week.getMonth())).slice(-2) + '-' + ('0' + next_week.getDate()).slice(-2);

    let last_week = new Date(as_date.getTime() - 7 * 24 * 60 * 60 * 1000);
    last_week = last_week.getFullYear() + '-' + ('0' + (1 + last_week.getMonth())).slice(-2) + '-' + ('0' + last_week.getDate()).slice(-2);

    return (
        <div className={'week-navigator'}>
            <div className={'top'}>
                <Link to={'/weekly/' + last_week}>Left</Link>
                <Link to={'/weekly/' + next_week}>Right</Link>
            </div>
            <WeeklyView start_date={start_date}/>
        </div>
    )
}