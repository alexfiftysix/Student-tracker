import React, {useEffect} from 'react'
import Note from './note'
import './allNotesPerStudent.css'

export default function AllNotesPerStudent(props) {
    const [notes_data, setNotesData] = React.useState(null);
    const student_id = props.student_id ? props.student_id : props.match.params.student_id;

    useEffect(() => {
        fetch('http://localhost:5000/student/notes/' + student_id)
            .then(results => results.json())
            .then(data => {
                setNotesData(data);
            });
    }, []);

    if (!notes_data) {
        return (
            <div className={'note_list'}>
                <p>Note Loading...</p>
            </div>
        );
    }

    return (
        <div className={'note_list'}>
            {notes_data.map(note =>
                <Note key={note.id} note_id={note.id}/>
            )}
        </div>
    );
}
