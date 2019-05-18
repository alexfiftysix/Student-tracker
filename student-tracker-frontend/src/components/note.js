import React, {useEffect} from 'react'
import './note.css'
import {Link} from "react-router-dom";

export default function Note(props) {
    const [note_data, setNoteData] = React.useState(null);

    const note_id = props.note_id ? props.note_id : this.props.match.pararms.note_id;

    // TODO: get date from url
    useEffect(() => {
        fetch('http://localhost:5000/student/note/' + note_id)
            .then(results => results.json())
            .then(data => {
                setNoteData(data);
            });
    }, []);

    if (!note_data) {
        return (
            <div className={'note'}>
                <p>Note Loading...</p>
            </div>
        );
    }

    return (
        <div className={'note'}>
            <Link to={'/student/' + note_data.student.id}>
                <h2>{note_data.student.name}</h2>
            </Link>
            <p className={"datetime"}>{note_data.date_and_time.substr(0, 16)}</p>
            <p className={"note_body"}>{note_data.notes}</p>
        </div>
    );
}
