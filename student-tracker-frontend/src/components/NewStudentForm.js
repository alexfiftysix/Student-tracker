import React from 'react'
import history from './history'
import currentDateAsString from '../utilities/dates'
import {makeStyles} from "@material-ui/core";
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
        padding: theme.spacing(2)
    },
    leftAlign: {
        textAlign: 'left'
    }
}));

export default function NewTeacherForm(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '',
        lesson_day: '',
        lesson_time: '15:00',
        lesson_duration: '',
        address: '',
        price: '',
        email: '',
    });

    const addressFields = ['unit_number', 'street_number', 'street_name', 'suburb', 'post_code', 'state', 'country'];
    const weekDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    function handleSubmit(event) {
        event.preventDefault();

        let url = 'http://localhost:5000/my_students';
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

    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.container, classes.flex)} noValidate autoComplete="off">
                <h2>New Student</h2>
                <h3>Details</h3>
                <TextField
                    id={'name'}
                    label={'Name'}
                    className={classes.textField}
                    margin="normal"
                    onChange={handleChange('name')}
                />
                <TextField
                    id={'email'}
                    label={'Email'}
                    className={classes.textField}
                    margin="normal"
                    onChange={handleChange('email')}
                />
                <FormControl className={classes.textField}>
                    <InputLabel htmlFor="age-simple">Lesson day</InputLabel>
                    <Select
                        className={classes.leftAlign}
                        value={values.lesson_day}
                        onChange={handleChange('lesson_day')}
                        inputProps={{
                            name: 'month',
                            id: 'age-simple',
                        }}
                    >
                        {weekDays.map(w =>
                            <MenuItem key={w} value={w}>{w}</MenuItem>
                        )}
                    </Select>
                </FormControl>
                <TextField
                    id="lesson_time"
                    label="Lesson Time"
                    type="time"
                    defaultValue="15:00"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        step: 300, // 5 min
                    }}
                    onChange={handleChange('lesson_time')}
                />
                <TextField
                    id={'lesson_duration'}
                    label={'Lesson Duration'}
                    className={classes.textField}
                    type={'number'}
                    margin="normal"
                    onChange={handleChange('lesson_duration')}
                />
                <FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
                    <InputLabel htmlFor="adornment-amount">Price</InputLabel>
                    <Input
                        id="price"
                        value={values.price}
                        type={'number'}
                        onChange={handleChange('price')}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    />
                </FormControl>
                <h3>Address</h3>
                {addressFields.map(f =>
                    <TextField
                        id={f}
                        key={f}
                        label={prepare(f)}
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange(f)}
                    />
                )}
                <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                    Submit
                </Button>
            </form>
        </Paper>
    );
}