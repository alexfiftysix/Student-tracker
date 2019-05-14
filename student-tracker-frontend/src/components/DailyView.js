import React, {useEffect} from 'react'
import Booking from "./Booking";
import './DailyView.css'

function DailyView(props) {
    const [bookings, setBookings] = React.useState(null);
    const date = props.date ? props.date : '2019-05-14';

    // TODO: get date from url
    useEffect(() => {
        fetch('http://localhost:5000/daily_appointments/' + date)
            .then(results => results.json())
            .then(data => {
                const bookings = data['appointments'];
                setBookings(bookings);
            });
    }, []);

    return (
        <div className={'booking-list'}>
            <header>{date}</header>
            {!bookings ? 'Loading...' : bookings.map(b =>
                <Booking key={b.id} name={b.student.name} time={b.time} attended={b.attended} payed={b.payed}
                         address={b.student.address} id={b.id}/>
            )}
        </div>
    );
}

export default DailyView;