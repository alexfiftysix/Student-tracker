import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import Booking from "./Booking";
import './DailyView.css'

export default function DailyView(props) {
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
                console.log(data);
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
        <div className={'booking-list'}>
            <h2><Link to={'/daily/' + date}>{day}</Link></h2>
            <h5>{date}</h5>
            {!bookings ? 'Loading...' : bookings.map(b =>
                <Booking key={b.lesson_plan.id} name={b.name} time={b.lesson_plan.lesson_time} attended={b.attended} payed={b.payed}
                         address={b.address} id={b.id} price={b.lesson_plan.price} end_time={b.lesson_plan.end_time}
                         student_id={b.id} date={date}/>
            )}
        </div>
    );
}
