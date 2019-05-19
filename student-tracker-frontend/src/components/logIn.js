import React from 'react'


export default class LogIn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        // TODO: Allow users to press enter instead of clicking
        event.preventDefault();

        let url = 'http://localhost:5000/user';
        let options = {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic '+btoa(this.state.username + ':' + this.state.password),
            },
            credentials: 'same-origin'
        };

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                localStorage.setItem('token',data['token']);
                console.log(localStorage.getItem('token'))
                // window.location = window.location;
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Log In</h2>
                <label>
                    <div>Username:</div>
                    <input name={'username'} type={'text'} value={this.state.username} onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Password:</div>
                    <input name={'password'} type={'password'} value={this.state.password}
                           onChange={this.handleChange}/>
                </label>
                <input type={'submit'} value={'Submit'}/>
            </form>
        )
    }


}