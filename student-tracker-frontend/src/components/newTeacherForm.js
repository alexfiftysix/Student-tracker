import React from 'react'
import history from './history'

export default class NewTeacherForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirm: '',
            standard_rate: ''
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
        event.preventDefault();
        if (this.state.password !== this.state.password_confirm) {
            alert("Passwords don't match");
            return;
        }

        let url = 'http://localhost:5000/teachers';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('name', this.state.name);
        options.body.append('email', this.state.email);
        options.body.append('password', this.state.password);
        options.body.append('standard_rate', this.state.standard_rate);

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                history.push('/log_in');
                window.location.assign(window.location);
            });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Welcome</h2>
                <label>
                    <div>Email:</div>
                    <input name={'email'} type={'text'} value={this.state.email} onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Name:</div>
                    <input name={'name'} type={'text'} value={this.state.name} onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Password:</div>
                    <input name={'password'} type={'password'} value={this.state.password}
                           onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Confirm password:</div>
                    <input name={'password_confirm'} type={'password'} value={this.state.password_confirm}
                           onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Standard rate:</div>
                    <input name={'standard_rate'} type={'number'} step={'.01'} value={this.state.standard_rate}
                           onChange={this.handleChange}/>
                </label>
                <input type={'submit'} value={'Submit'}/>
            </form>
        )
    }

}