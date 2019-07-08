import React from 'react';
import './Booking.css';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox';

export default function Booking(props) {
    const [state, setState] = React.useState({
        id: props.id,
        name: props.name,
        time: props.time,
        end_time: props.end_time,
        address: props.address,
        attended: props.attended,
        payed: props.payed,
        price: props.price,
        student_id: props.student_id,
        message: '',
        date: props.date,
        length: props.length,
    });

    function changePayed() {
        let url = 'http://localhost:5000/my_students/payment/' + state.student_id;
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

        options.body.append('lesson_date_time', String(state.date + '_' + state.time));
        if (state.payed) {
            options.body.append('amount', '0');
        } else {
            options.body.append('amount', String(state.price));
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);


        setState({...state, 'payed': !state.payed});
    }

    function changeAttended() {
        let url = 'http://localhost:5000/my_students/attendance/' + state.student_id;
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

        options.body.append('lesson_date_time', String(state.date + ' ' + state.time));
        options.body.append('lesson_length', String(state.length)); // TODO: Get dynamically
        options.body.append('attended', String(!state.attended));
        options.body.append('cancelled', String(false)); // TODO: Get dynamically
        options.body.append('price', String(state.price));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        setState({...state, 'attended': !state.attended});
    }

    return (
        <Paper className={'booking'}>
            <div>
                <Link to={'/student/' + state.student_id} className={'lefty'}>
                    <h3>{state.name}</h3>
                </Link>
                <h4>{String(state.time).substr(0, 5)}-{String(state.end_time).substr(0, 5)}</h4>
            </div>

            <div>
                <p className={'lefty'}>{state.address}</p>
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
                <p className={'price lefty'}>${state.price}</p>
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
