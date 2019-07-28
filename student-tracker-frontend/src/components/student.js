import React, {useEffect} from 'react'
import './student.css'
import {Link} from "react-router-dom"
import {makeStyles} from '@material-ui/core/styles'
import config from '../config'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Dialog from '@material-ui/core/Dialog'
import currentDateAsString from '../utilities/dates'

const useStyles = makeStyles(theme => ({
    caps: {
        textTransform: 'capitalize',
    },
    lesson_time: {
        border: '1px solid black',
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        textAlign: 'left'
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& *': {
            boxShadow: 'none',
        }
    },
    change: {
        padding: theme.spacing(2),
    },
}));

function deleteLessonTime(lessonId) {
    // Sets the end-date of the lesson plan to today
    const today = currentDateAsString();
    const url = config.serverHost + 'lesson_time/' + lessonId;
    let options = {
        method: 'put',
        headers: {
            'x-access-token': localStorage.getItem('token')
        },
        body: new FormData(),
    };
    options.body.append('end_date', today);
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function ChangeTime(props) {
    return(
        <Paper>Change Lesson Time!</Paper>
    )
}


export default function Student(props) {
    const [student, setStudent] = React.useState(null);
    const [open, setOpen] = React.useState(false);
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

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


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
                <li>
                    <Link to={'/change_lesson_time/' + student.id}>
                        <p>Change lesson time</p>
                    </Link>
                </li>
            </ul>

            <h3>Lesson times</h3>
            {student.plans.map(p =>
                <div key={p.id} className={classes.lesson_time}>
                    <div>{p.lesson_time} {p.lesson_day}</div>
                    <div>{p.start_date} - {p.end_date !== 'None' ? p.end_date : ''}</div>
                    <Button variant={'contained'} onClick={e => deleteLessonTime(p.id)}>Delete lesson time</Button>
                    <Button variant={'contained'} onClick={handleOpen}>Change lesson time</Button>
                    <Dialog className={classes.modal} open={open} onClose={handleClose}><ChangeTime className={classes.change}/></Dialog>
                </div>
            )}
            <Button variant={'contained'}>Add lesson time</Button>
        </div>
    );
}