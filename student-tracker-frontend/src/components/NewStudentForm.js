import React, {useState} from 'react'
import history from './history'
import currentDateAsString from '../utilities/dates'
import {makeStyles} from "@material-ui/core"
import clsx from 'clsx'
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button"
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import Select from "@material-ui/core/Select"
import config from '../config'
import useForm from 'react-hook-form'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    margin: {
        marginTop: theme.spacing(1),
    },
    button: {
        marginTop: theme.spacing(1),
    },
    flex: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        width: '500px',
        maxWidth: '90vw',
    },
    leftAlign: {
        textAlign: 'left'
    },
    section: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
}));

export default function NewTeacherForm(props) {
    // TODO: Use Material-ui stepper
    const classes = useStyles();
    const {register, handleSubmit, errors} = useForm();
    const [values, setValues] = React.useState({
        name: '',
        lesson_day: 'Monday',
        lesson_time: '15:00',
        lesson_duration: '',
        address: '',
        price: '',
        email: '',
    });
    const [lessonDay, setLessonDay] = useState('Monday');


    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    const handleDayChange = name => event => {
        setLessonDay(event.target.value);
    };

    function handleSubmitOld(event) {
        event.preventDefault();

        let url = config.serverHost + 'my_students';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        for (let key in values) {
            options.body.append(key, values[key]);
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                history.push('/weekly/' + currentDateAsString());
                window.location.assign(window.location);
            });
    }


    function prepare(str) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str.replace('_', ' ')
    }

    const fields = [
        {
            name: 'name',
            required: true,
            label: 'Name',
            autoFocus: true
        },
        {
            name: 'email',
            required: true,
            label: 'Email',
            pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        },
        {
            name: 'price',
            required: true,
            type: 'number',
            label: 'Lesson Price ($)'
        },
        {
            name: 'lesson_time',
            required: true,
            type: 'time',
            label: 'Lesson time',
            defaultValue: '15:00'
        },
        {
            name: 'lesson_length_minutes',
            required: true,
            type: 'number',
            label: 'Lesson duration',
            defaultValue: 30
        },
    ];
    const addressFields = [
        {name: 'unit_number', required: false},
        {name: 'street_number', required: true},
        {name: 'street_name', required: true},
        {name: 'suburb', required: true},
        {name: 'post_code', required: false},
        {name: 'state', required: false},
        {name: 'country', required: false},
    ];
    const weekDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    // lesson day is special

    const onSubmit = data => {
        let url = config.serverHost + 'my_students';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        for (const f in fields) {
            options.body.append(fields[f].name, data[fields[f].name]);
        }
        for (const f in addressFields) {
            options.body.append(addressFields[f].name, data[addressFields[f].name]);
        }
        options.body.append('lesson_day', lessonDay);

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    alert(data.message)
                } else {
                    history.push('/weekly/' + currentDateAsString());
                    window.location.assign(window.location);
                }
            });
    };

    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.container, classes.flex)} onSubmit={handleSubmit(onSubmit)} noValidate>
                <h2>New Student</h2>
                <h3>Details</h3>

                <div className={classes.section}>
                    {fields.map(f =>
                        <TextField
                            placeholder={f.label}
                            id={f.name}
                            name={f.name}
                            key={f.name}
                            className={classes.textField}
                            label={(f.required ? '* ' : '') + f.label}
                            error={!!errors[f.name]}
                            type={f.type || 'text'}
                            defaultValue={f.defaultValue || ''}
                            autoFocus={!!f.autoFocus}
                            inputRef={register({
                                required: !!f.required,
                                pattern: f.pattern ? f.pattern : null
                            })}
                        />
                    )}
                    <FormControl className={classes.textField}>
                        <InputLabel htmlFor={'weekday'}>* Lesson day</InputLabel>
                        <Select
                            native
                            className={classes.leftAlign}
                            value={values.lesson_day}
                            error={!!errors.lesson_day}
                            onChange={handleDayChange}
                            inputProps={{
                                name: 'weekday',
                                id: 'weekday',
                            }}
                            inputRef={register({
                                required: true
                            })}
                        >
                            {weekDays.map(w =>
                                <option key={w} value={w}>{w}</option>
                            )}
                        </Select>
                    </FormControl>
                </div>
                <h3>Address</h3>
                <div className={classes.section}>
                    {addressFields.map(f =>
                        <TextField
                            name={f.name}
                            key={f.name}
                            label={prepare(f.name) + (errors[f.name] ? ' is required' : '')}
                            error={!!errors[f.name]}
                            className={classes.textField}
                            required={f.required}
                            inputRef={register({required: f.required,})}
                            margin="normal"
                            // onChange={handleChange(f)}
                        />
                    )}
                </div>
                <Button
                    type={'submit'}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    );
}