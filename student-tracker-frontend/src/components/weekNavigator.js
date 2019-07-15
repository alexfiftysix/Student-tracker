import React from 'react'
import {Link} from "react-router-dom"
import WeeklyView from './WeeklyView'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
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
    top: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: '10px',
    }
}));

export default function WeekNavigator(props) {
    const classes = useStyles();
    const start_date = props.match.params.start_date;
    const as_date = new Date(start_date);

    let next_week = new Date(as_date.getTime() + 7 * 24 * 60 * 60 * 1000);
    next_week = next_week.getFullYear() + '-' + ('0' + (1 + next_week.getMonth())).slice(-2) + '-' + ('0' + next_week.getDate()).slice(-2);

    let last_week = new Date(as_date.getTime() - 7 * 24 * 60 * 60 * 1000);
    last_week = last_week.getFullYear() + '-' + ('0' + (1 + last_week.getMonth())).slice(-2) + '-' + ('0' + last_week.getDate()).slice(-2);

    return (
        <div className={'week-navigator'}>
            <div className={classes.top}>
                <Link className={classes.button} to={'/weekly/' + last_week}><ChevronLeft/><p>Back one week</p></Link>
                <Link className={classes.button} to={'/weekly/' + next_week}><p>Forwards one week</p>
                    <ChevronRight/></Link>
            </div>
            <WeeklyView start_date={start_date}/>
        </div>
    )
}