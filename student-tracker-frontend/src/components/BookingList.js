import React, {useEffect} from 'react'
import Booking from "./Booking";

function BookingList(props) {
    const [bookings, setBookings] = React.useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/daily_appointments/2019-05-14')
            .then(results => results.json())
            .then(data => {
                const bookings = data['appointments'];
                setBookings(bookings);
            });
    }, []);

    return (
        <div>
            {!bookings ? 'Loading...' : bookings.map(b =>
                <Booking key={b.id} name={b.student.name} time={b.time} attended={b.attended} payed={b.payed} address={b.student.address}/>
            )}
        </div>
    );
}

export default BookingList;