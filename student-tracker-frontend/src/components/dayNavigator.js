import React from 'react'
import {Link} from "react-router-dom";
import DailyView from './DailyView'
import './dayNavigator.css'

export default function DayNavigator(props) {
    const date = props.match.params.date;
    let as_date = new Date(date);

    let tomorrow = new Date(as_date.getTime() + 24 * 60 * 60 * 1000);
    tomorrow = tomorrow.getFullYear() + '-' + ('0' + (1 + tomorrow.getMonth())).slice(-2) + '-' + tomorrow.getDate();
    console.log(tomorrow);

    let yesterday = new Date(as_date.getTime() - 24 * 60 * 60 * 1000);
    yesterday = yesterday.getFullYear() + '-' + ('0' + (1 + yesterday.getMonth())).slice(-2) + '-' + yesterday.getDate();

    return (
        <div className={'day-navigator'}>
            <div className={'top'}>
                <Link to={'/daily/' + yesterday}>Yesterday</Link>
                <Link to={'/daily/' + tomorrow}>Tomorrow</Link>
            </div>
            <DailyView date={date}/>
        </div>
    )
}