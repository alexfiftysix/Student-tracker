import React from 'react';
import './Booking.css';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox';
import Popover from '@material-ui/core/Popover'

export default function Booking(props) {
    const [state, setState] = React.useState({
        attended: props.attended,
        payed: props.payed,
        date: props.date,
        booking: props.booking
    });

    function changePayed() {
        let url = 'http://localhost:5000/my_students/payment/' + state.booking.id;
        const token = localStorage.getItem('token');
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'x-access-token': token
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('lesson_date_time', String(state.date + '_' + state.booking.lesson_plan.lesson_time));
        if (state.payed) {
            options.body.append('amount', '0');
        } else {
            options.body.append('amount', String(state.booking.lesson_plan.price));
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);


        setState({...state, 'payed': !state.payed});
    }

    function changeAttended() {
        let url = 'http://localhost:5000/my_students/attendance/' + state.booking.id;
        const token = localStorage.getItem('token');

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'x-access-token': token
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('lesson_date_time', String(state.date + ' ' + state.booking.lesson_plan.lesson_time));
        options.body.append('lesson_length', String(state.booking.lesson_plan.length_minutes));
        options.body.append('attended', String(!state.attended));
        options.body.append('cancelled', String(false)); // TODO: Get dynamically
        options.body.append('price', String(state.booking.lesson_plan.price));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        setState({...state, 'attended': !state.attended});
    }

    // Popover stuff
    const [anchorEl, setAnchorEl] = React.useState(null);

    function openPopover(event) {
        setAnchorEl(event.currentTarget);
    }

    function closePopover() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'address-popover' : undefined;
    // end Popover stuff

    return (
        <Paper className={'booking'}>
            <div>
                <Link to={'/student/' + state.booking.id} className={'lefty name'}>
                    <h3>{state.booking.name}</h3>
                </Link>
                <h4>{String(state.booking.lesson_plan.lesson_time).substr(0, 5)}-{String(state.booking.lesson_plan.end_time).substr(0, 5)}</h4>
            </div>

            <div>
                <p className={'lefty address'} onClick={openPopover}>{state.booking.address.suburb ? state.booking.address.suburb : 'Address'}</p>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >{state.booking.address.printable}</Popover>
                <div className={'attended'}>
                    Attended
                    <Checkbox
                        checked={state.attended}
                        onChange={changeAttended}
                        color="primary"
                        value="attended"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                </div>
            </div>

            <div>
                <p className={'price lefty'}>${state.booking.lesson_plan.price}</p>
                <div>Paid
                    <Checkbox
                        checked={state.payed}
                        onChange={changePayed}
                        color="primary"
                        value="payed"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                </div>
            </div>
        </Paper>
    );
}
