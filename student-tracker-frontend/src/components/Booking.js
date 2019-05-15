import React from 'react';
import './Booking.css';


export default class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state['id'] = props.id;
        this.state['name'] = props.name;
        this.state['time'] = props.time;
        this.state['duration'] = props.duration;
        this.state['address'] = props.address;
        this.state['attended'] = props.attended;
        this.state['payed'] = props.payed;
        this.state['price'] = props.price;
        console.log(this.state.id);

        this.changeAttended = this.changeAttended.bind(this);
        this.changePayed = this.changePayed.bind(this);
    }

    changePayed() {
        let url = 'http://localhost:5000/appointment/' + this.state['id'];
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('payed', String(!this.state.payed));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);


        this.setState({'payed': !this.state.payed});
    }

    changeAttended() {
        let url = 'http://localhost:5000/appointment/' + this.state['id'];
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('attended', String(!this.state.attended));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        this.setState({'attended': !this.state.attended});
    }


    render() {
        console.log(this.state.duration);
        return (
            <div className={'booking'}>
                <h3>{this.state.name}</h3>
                <p className={'time'}>{String(this.state.time).substr(0, 5)}</p>
                <p className={'address'}>{this.state.address}</p>
                <div onClick={this.changeAttended}
                     className={'attended ' + (this.state.attended ? 'success' : 'failure')}>Attended
                </div>
                <div onClick={this.changePayed}
                     className={'payed ' + (this.state.payed ? 'success' : 'failure')}>Paid
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