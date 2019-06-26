import React from 'react';
import './Booking.css';
import {Link} from "react-router-dom";

export default class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state['id'] = props.id;
        this.state['name'] = props.name;
        this.state['time'] = props.time;
        this.state['end_time'] = props.end_time;
        this.state['address'] = props.address;
        this.state['attended'] = props.attended;
        this.state['payed'] = props.payed;
        this.state['price'] = props.price;
        this.state['student_id'] = props.student_id;
        this.state['message'] = '';
        this.state['date'] = props.date;

        this.changeAttended = this.changeAttended.bind(this);
        this.changePayed = this.changePayed.bind(this);
    }

    changePayed() {
        let url = 'http://localhost:5000/my_students/payment/' + this.state.student_id;
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

        options.body.append('lesson_date_time', String(this.state.date + '_' + this.state.time));
        if (this.state.payed) {
            options.body.append('amount', '0');
        } else {
            options.body.append('amount', String(this.state.price));
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);


        this.setState({'payed': !this.state.payed});
    }

    changeAttended() {
        let url = 'http://localhost:5000/my_students/attendance/' + this.state.student_id;
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

        options.body.append('lesson_date_time', String(this.state.date + ' ' + this.state.time));
        options.body.append('lesson_length', '30'); // TODO: Get dynamically
        options.body.append('attended', String(!this.state.attended));
        options.body.append('cancelled', String(false)); // TODO: Get dynamically
        options.body.append('price', String(this.state.price));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        this.setState({'attended': !this.state.attended});
    }


    render() {
        if (this.state['message']) {
            return <div className={'booking'}>{this.state['message']}</div>
        }

        return (
            <div className={'booking'}>
                <Link to={'/student/' + this.state.student_id} className={'link'}>
                    <h3>{this.state.name}</h3>
                </Link>
                <p className={'time'}>{String(this.state.time).substr(0, 5)}-{String(this.state.end_time).substr(0, 5)}</p>
                <p className={'address'}>{this.state.address}</p>
                <div onClick={this.changeAttended}
                     className={'attended ' + (this.state.attended ? 'success' : 'failure')}>{this.state.attended ? '' : 'Not '}Attended
                </div>
                <div onClick={this.changePayed}
                     className={'payed ' + (this.state.payed ? 'success' : 'failure')}>{this.state.payed ? '' : 'Not '}Paid
                </div>
                <p className={'price'}>${this.state.price}</p>
            </div>
        );
    }
}

/*function Booking(props) {
    const [attended, setAttended] = React.useState(props.attended);
    const [payed, setPayed] = React.useState(props.payed);


    return (
        <div className={'booking'}>
            <h3>{props.name}</h3>
            <p className={'time'}>{props.time}</p>
            <p className={'address'}>{props.address}</p>
            <div className={'attended ' + (props.attended ? 'success' : 'failure')}>Attended</div>
            <div onClick={changePayed} className={'payed ' + (props.payed ? 'success' : 'failure')}>Paid</div>
        </div>
    );
}

Booking.propTypes = {
    name: PropTypes.string.isRequired
};*/


// export default Booking