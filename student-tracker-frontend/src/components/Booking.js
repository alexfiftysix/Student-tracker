import React from 'react';
import PropTypes from 'prop-types'
import './Booking.css'

function Booking(props) {
    return (
        <div className={'booking'}>
            <h3>{props.name}</h3>
            <p className={'time'}>{props.time}</p>
            <p className={'address'}>{props.address}</p>
            <div className={'attended ' + (props.attended ? 'success' : 'failure')}>Attended</div>
            <div className={'payed ' + (props.payed ? 'success' : 'failure')}>Payed</div>
        </div>
    );
}

Booking.propTypes = {
    name: PropTypes.string.isRequired
};


export default Booking