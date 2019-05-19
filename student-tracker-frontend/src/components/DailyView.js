import React, {useEffect} from 'react'
import Booking from "./Booking";
import './DailyView.css'

export default function DailyView(props) {
    const [bookings, setBookings] = React.useState(null);
    const date = props.date ? props.date : '2019-05-14';

    // TODO: get date from url
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
        <div className={'booking-list'}>
            <h2>{day}</h2>
            <h5>{date}</h5>
            {!bookings ? 'Loading...' : bookings.map(b =>
                <Booking key={b.id} name={b.student.name} time={b.time} attended={b.attended} payed={b.payed}
                         address={b.student.address} id={b.id} price={b.student.price} end_time={b.student.lesson_end}
                         student_id={b.student.id}/>
            )}
        </div>
    );
}
