import React from 'react';
import './Booking.css';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    booking: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        rowGap: '5px',
        columnGap: '5px',
        gridTemplateAreas: "'nm nm nm attended payed' 'tm addr addr addr price'",
        color: 'black',
        textAlign: 'left',
        padding: theme.spacing(1),
        margin: theme.spacing(1),

    },
}));

export default function Booking(props) {
    const classes = useStyles();
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
        <Paper className={classes.booking}>
            <Link to={'/student/' + state.student_id}>
                <h3>{state.name}</h3>
            </Link>
            <p className={'time'}>{String(state.time).substr(0, 5)}-{String(state.end_time).substr(0, 5)}</p>
            <p className={'address'}>{state.address}</p>
            <div onClick={changeAttended}
                 className={'attended ' + (state.attended ? 'success' : 'failure')}>{state.attended ? '' : 'Not '}Attended
            </div>
            <div onClick={changePayed}
                 className={'payed ' + (state.payed ? 'success' : 'failure')}>{state.payed ? '' : 'Not '}Paid
            </div>
            <p className={'price'}>${state.price}</p>
        </Paper>
    );
}
