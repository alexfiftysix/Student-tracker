import React from 'react'
import {Link} from "react-router-dom";
import DailyView from './DailyView'
import './dayNavigator.css'
import {makeStyles} from "@material-ui/core";
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles(theme => ({
    navigator: {
        justifyContent: 'center',
        margin: theme.spacing(3),
    },
    top: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        background: 'white',
        padding: '5px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        margin: '0 5px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
}));

export default function DayNavigator(props) {
    const classes = useStyles();
    const date = props.match.params.date;
    let as_date = new Date(date);

    let tomorrow = new Date(as_date.getTime() + 24 * 60 * 60 * 1000);
    tomorrow = tomorrow.getFullYear() + '-' + ('0' + (1 + tomorrow.getMonth())).slice(-2) + '-' + tomorrow.getDate();
    console.log(tomorrow);

    let yesterday = new Date(as_date.getTime() - 24 * 60 * 60 * 1000);
    yesterday = yesterday.getFullYear() + '-' + ('0' + (1 + yesterday.getMonth())).slice(-2) + '-' + yesterday.getDate();

    return (
        <div className={classes.navigator}>
            <div className={classes.top}>
                <Link className={classes.button} to={'/daily/' + yesterday}><ChevronLeft/><p>Yesterday</p></Link>
                <Link className={classes.button} to={'/daily/' + tomorrow}><p>Tomorrow</p><ChevronRight/></Link>
            </div>
            <DailyView date={date}/>
        </div>
    )
}