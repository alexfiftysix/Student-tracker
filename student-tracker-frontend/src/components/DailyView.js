import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import Booking from "./Booking";
import Paper from '@material-ui/core/Paper'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    paper: {
        margin: theme.spacing(0.2),
        padding: theme.spacing(1),
        backgroundColor: '#f5f5ef',
    },
    header: {
        textDecoration: 'none',
        color: 'black',
        "&:visited": {
            color: 'black',
        }
    }
}));

export default function DailyView(props) {
    const classes = useStyles();
    const [bookings, setBookings] = React.useState(null);
    const date = props.date ? props.date : props.match.params.start_date;

    useEffect(() => {
        fetch('http://localhost:5000/my_appointments/daily/' + date,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                setBookings(data);
            });
    }, [date]);

    let day = new Date(Date.parse(date)).getDay();
    const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    day = weekdays[day];

    if (!bookings) {
        return (<div className={'booking-list'}>Loading...</div>);
    }

    if (bookings['message']) {
        return (<div className={'booking-list'}>{bookings['message']}</div>);
    }


    return (
        <Paper className={classes.paper}>
            <h2 ><Link to={'/daily/' + date} className={classes.header}>{day}</Link></h2>
            <h5>{date}</h5>
            {!bookings ? 'Loading...' : bookings.map(b =>
                <Booking key={b.lesson_plan.id} attended={b.attended} payed={b.payed}
                         date={date} booking={b}/>
            )}
        </Paper>
    );
}
