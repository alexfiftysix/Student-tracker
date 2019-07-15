import React from 'react'
import {Link} from "react-router-dom"
import DailyView from './DailyView'
import './dayNavigator.css'
import {makeStyles} from "@material-ui/core"
import dateFns from "date-fns"

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
    const dateFormat = 'YYYY-MM-DD';
    let date = props.match.params.date;
    let as_date = new Date(date);

    let tomorrow = new Date(as_date.getTime() + 24 * 60 * 60 * 1000);
    tomorrow = dateFns.format(tomorrow, dateFormat);

    let yesterday = new Date(as_date.getTime() - 24 * 60 * 60 * 1000);
    yesterday = dateFns.format(yesterday, dateFormat);

    let nextWeek = new Date(as_date.getTime() + 7 * 24 * 60 * 60 * 1000);
    nextWeek = dateFns.format(nextWeek, dateFormat);

    let lastWeek = new Date(as_date.getTime() - 7 * 24 * 60 * 60 * 1000);
    lastWeek = dateFns.format(lastWeek, dateFormat);

    // TODO: doesn't change after going up or back one week until refresh
    return (
        <div className={classes.navigator}>
            <div className={classes.top}>
                <Link className={classes.button} to={'/daily/' + lastWeek}> &lt;&lt; </Link>
                <Link className={classes.button} to={'/daily/' + yesterday}> &lt; </Link>
                <Link className={classes.button} to={'/daily/' + tomorrow}> > </Link>
                <Link className={classes.button} to={'/daily/' + nextWeek}>  >> </Link>
            </div>
            <DailyView date={date}/>
        </div>
    )
}