import React from 'react'
import {Link} from "react-router-dom";
import WeeklyView from './WeeklyView'
import './weekNavigator.css'

export default function WeekNavigator(props) {
    const start_date = props.match.params.start_date;

    const as_date = new Date(start_date);

    let next_week = new Date();
    next_week.setDate(as_date.getDate() + 7);
    next_week = next_week.getFullYear() + '-' + ('0' + (1 + next_week.getMonth())).slice(-2) + '-' + next_week.getDate();

    let last_week = new Date();
    last_week.setDate(as_date.getDate() - 7);
    last_week = last_week.getFullYear() + '-' + ('0' + (1 + last_week.getMonth())).slice(-2) + '-' + last_week.getDate();

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