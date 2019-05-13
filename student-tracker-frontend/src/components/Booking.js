import React from 'react';
import PropTypes from 'prop-types'
import './booking.css'

function Booking(props) {
    return (
        <div className={'booking'}>
            <h3>{props.name}</h3>
            <p>{props.time} <br/> {props.address}</p>
            <div className={'button ' + (props.attended ? 'success' : 'failure')}>Attended</div>
            <div className={'button ' + (props.payed ? 'success' : 'failure')}>Payed</div>
        </div>
    );
}

Booking.propTypes = {
    name: PropTypes.string.isRequired
};


export default Booking