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
        background: 'none',
        textAlign: 'center',
        textDecoration: 'none',
        margin: '0 2em',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        '&:visited': {
            color: 'white',
        },
        '&:hover': {
            textShadow: '0 0 5px rgba(255,255,255,0.4)',
        }
    },
}));

export default function DayNavigator(props) {
    const classes = useStyles();
    let date = props.match.params.date;
    let as_date = new Date(date);

    let tomorrow = new Date(as_date.getTime() + 24 * 60 * 60 * 1000);
    tomorrow = tomorrow.getFullYear() + '-' + ('0' + (1 + tomorrow.getMonth())).slice(-2) + '-' + tomorrow.getDate();

    let yesterday = new Date(as_date.getTime() - 24 * 60 * 60 * 1000);
    yesterday = yesterday.getFullYear() + '-' + ('0' + (1 + yesterday.getMonth())).slice(-2) + '-' + yesterday.getDate();

    let next_week = new Date(as_date.getTime() + 7 * 24 * 60 * 60 * 1000);
    next_week = next_week.getFullYear() + '-' + ('0' + (1 + next_week.getMonth())).slice(-2) + '-' + ('0' + next_week.getDate()).slice(-2);

    let last_week = new Date(as_date.getTime() - 7 * 24 * 60 * 60 * 1000);
    last_week = last_week.getFullYear() + '-' + ('0' + (1 + last_week.getMonth())).slice(-2) + '-' + ('0' + last_week.getDate()).slice(-2);

    // TODO: doesn't change after going up or back one week until refresh
    return (
        <div className={classes.navigator}>
            <div className={classes.top}>
                <Link className={classes.button} to={'/daily/' + last_week}> &lt;&lt; </Link>
                <Link className={classes.button} to={'/daily/' + yesterday}> &lt; </Link>
                <Link className={classes.button} to={'/daily/' + tomorrow}> > </Link>
                <Link className={classes.button} to={'/daily/' + next_week}>  >> </Link>
            </div>
            <DailyView date={date}/>
        </div>
    )
}