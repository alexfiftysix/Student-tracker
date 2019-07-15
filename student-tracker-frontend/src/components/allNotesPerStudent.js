import React, {useEffect} from 'react'
import Note from './note'
import './allNotesPerStudent.css'
import config from '../config'

export default function AllNotesPerStudent(props) {
    const [notes_data, setNotesData] = React.useState(null);
    const student_id = props.student_id ? props.student_id : props.match.params.student_id;

    useEffect(() => {
        fetch(config.serverHost + 'student/notes/' + student_id,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                setNotesData(data);
            });
    }, [student_id]);

    if (!notes_data) {
        return (
            <div className={'note_list'}>
                <p>Note Loading...</p>
            </div>
        );
    }

    if (notes_data['message']) {
        return (
            <div className={'note_list'}>
                <p>{notes_data['message']}</p>
            </div>
        );
    }


    // TODO: Optimise this to use the all-notes route to build notes rather than making lots of requests
    return (
        <div className={'note_list'}>
            {notes_data.map(note =>
                <Note key={note.id} note_id={note.id}/>
            )}
        </div>
    );
}
