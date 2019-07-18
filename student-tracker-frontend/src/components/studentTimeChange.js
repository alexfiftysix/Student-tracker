import React, {useEffect, useState} from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from "@material-ui/core"
import useForm from 'react-hook-form'
import Input from '@material-ui/core/Input'
import config from "../config"
import Button from "@material-ui/core/Button"
import TextField from '@material-ui/core/TextField'
import history from "./history";
import currentDateAsString from "../utilities/dates";


const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1),
        margin: theme.spacing(1),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    textField: {
        margin: theme.spacing(1),
        marginBottom: theme.spacing(4),
        width: 200,
    },
}));

export default function StudentTimeChange(props) {
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();
    const [warning, setWarning] = React.useState(null);
    const [student, setStudent] = useState(null);
    const student_id = props.match.params.student_id;

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
    }, [props, student_id]);

    const onSubmit = data => {
        const url = config.serverHost + 'my_students/lesson_time/' + student_id;
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        const keys = ['start_date', 'lesson_time', 'lesson_day', 'lesson_length_minutes', 'price'];

        keys.forEach(key => {
            options.body.append(key, data[key]);
        });

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                history.push('/weekly/' + currentDateAsString());
                window.location.assign(window.location);
            });

    };

    if (!student) {
        return <div>Loading...</div>
    }

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h4'}>Change Lesson Time</Typography>
            <Typography variant={'h6'}>{student.name}</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField label={'Start Date'} name={'start_date'} type={'date'} inputRef={register({required: true})} className={classes.textField} autoFocus={true}/>
                <TextField label={'Lesson Time'} name={'lesson_time'} type={'time'} inputRef={register({required: true})} className={classes.textField} defaultValue={student.lesson_plan.lesson_time}/>
                <TextField label={'Lesson Day'} name={'lesson_day'} inputRef={register({required: true})} className={classes.textField} defaultValue={student.lesson_plan.lesson_day}/>
                <TextField label={'Lesson Length (minutes)'} name={'lesson_length_minutes'} type={'number'} inputRef={register({required: true})} className={classes.textField} defaultValue={student.lesson_plan.length_minutes}/>
                <TextField label={'Price ($)'} name={'price'} type={'number'} inputRef={register({required: true})} className={classes.textField} defaultValue={student.lesson_plan.price}/>
                <Button type={'submit'} variant="contained" color="primary" className={classes.button} onClick={onSubmit}>
                    Submit
                </Button>
            </form>
        </Paper>
    );
}