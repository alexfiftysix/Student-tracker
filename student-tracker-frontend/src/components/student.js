import React, {useEffect} from 'react'
import './student.css'
import {Link} from "react-router-dom"
import {makeStyles} from '@material-ui/core/styles'
import config from '../config'

const useStyles = makeStyles({
    caps: {
        textTransform: 'capitalize',
    }
});

export default function Student(props) {
    const [student, setStudent] = React.useState(null);
    const student_id = props.id ? props.id : props.match.params.student_id;
    const classes = useStyles();

    useEffect(() => {
        fetch(config.serverHost + 'student/' + student_id,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                setStudent(data);
            });
    }, [student_id]);


    if (!student) {
        return <h1>Student loading...</h1>;
    }

    return (
        <div className={'student'}>
            <h2>{student.name}</h2>
            <ul>
                <li>
                    <h4>Day:</h4>
                    <p className={classes.caps}>{student.lesson_plan.lesson_day}</p>
                </li>
                <li>
                    <h4>Lesson time:</h4>
                    <p>{student.lesson_plan.lesson_time} - {student.lesson_plan.end_time}</p>
                </li>
                {student.email !== 'None' ?
                    <li>
                        <h4>Email:</h4>
                        <p>{student.email}</p>
                    </li>
                    : null
                }
                <li>
                    <h4>Address:</h4>
                    <p>{student.address.street_number} {student.address.street_name}, {student.address.suburb}</p>
                </li>
                <li>
                    <h4>Price:</h4>
                    <p>${student.lesson_plan.price}</p>
                </li>
                <li>
                    <Link to={'/student_notes/' + student.id}>
                        <p>View notes</p>
                    </Link>
                </li>
                <li>
                    <Link to={'/student_add_notes/' + student.id}>
                        <p>Add notes</p>
                    </Link>
                </li>
            </ul>

        </div>
    );
}