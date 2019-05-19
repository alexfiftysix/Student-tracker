import React from 'react'
import './newNoteForm.css'
import {Link} from "react-router-dom";
import history from './history'


export default class NewNoteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student_id: props.student_id ? props.student_id : props.match.params.student_id,
            notes: '',
            student_name: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:5000/student/' + this.state.student_id)
            .then(results => results.json())
            .then(data => {
                this.setState({student_name: data.name});
            });
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
        let url = 'http://localhost:5000/student/notes/' + this.state.student_id;
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('student_id', this.state.student_id);
        options.body.append('notes', this.state.notes);

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                history.push('/student/' + this.state.student_id);
                window.location.assign(window.location);
            });

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className={'new_note_form'}>
                <Link to={'/student/' + this.state.student_id}>
                    <h2>{this.state.student_name}</h2>
                </Link>
                <h3>Add notes</h3>
                <label>
                    <div>Notes:</div>
                    <textarea name={'notes'} value={this.state.name} onChange={this.handleChange}/>
                </label>
                <input type={'submit'} value={'Submit'}/>
            </form>
        )
    }
}
