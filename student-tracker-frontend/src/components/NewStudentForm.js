import React from 'react'
import './newStudentForm.css'

export default class NewStudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            lesson_day: '',
            lesson_time: '',
            address: '',
            price: ''
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
        let url = 'http://localhost:5000/student/0';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('name', this.state.name);
        options.body.append('lesson_day', this.state.lesson_day);
        options.body.append('lesson_time', this.state.lesson_time);
        options.body.append('address', this.state.address);
        options.body.append('price', this.state.price);

        fetch(url, options)
            .then(response => response.json())
            .then(data => alert(data));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Add new Student</h2>
                <label>
                    <div>Name:</div>
                    <input name={'name'} type={'text'} value={this.state.name} onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Lesson day:</div>
                    <input name={'lesson_day'} type={'text'} value={this.state.lesson_day}
                           onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Lesson time:</div>
                    <input name={'lesson_time'} type={'text'} value={this.state.lesson_time}
                           onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Address:</div>
                    <input name={'address'} type={'text'} value={this.state.address} onChange={this.handleChange}/>
                </label>
                <label>
                    <div>Price:</div>
                    <input name={'price'} type={'number'} step={'.01'} value={this.state.price}
                           onChange={this.handleChange}/>
                </label>
                <input type={'submit'} value={'Submit'}/>
            </form>
        )
    }

}