import React from 'react'
import {Link} from "react-router-dom";
import DailyView from './DailyView'
import './dayNavigator.css'

export default function DayNavigator(props) {
    const date = props.match.params.date;
    let as_date = new Date(date);

    let tomorrow = new Date();
    tomorrow.setDate(as_date.getDate() + 1);
    tomorrow = tomorrow.getFullYear() + '-' + ('0' + (1 + tomorrow.getMonth())).slice(-2) + '-' + tomorrow.getDate();

    let yesterday = new Date();
    yesterday.setDate(as_date.getDate() - 1);
    yesterday = yesterday.getFullYear() + '-' + ('0' + (1 + yesterday.getMonth())).slice(-2) + '-' + yesterday.getDate();

    return (
        <div className={'day-navigator'}>
            <div className={'top'}>
                <Link to={'/daily/' + yesterday}>Left</Link>
                <Link to={'/daily/' + tomorrow}>Right</Link>
            </div>
            <DailyView date={date}/>
        </div>
    )
}