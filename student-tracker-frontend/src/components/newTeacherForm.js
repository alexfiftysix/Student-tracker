import React from 'react'
import history from './history'
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '40%'
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
        width: '500px',
        maxWidth: '90vw',
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
    const [values, setValues] = React.useState({
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        standard_rate: '',
        unit_number: '',
        street_number: '',
        street_name: '',
        suburb: '',
        post_code: '',
        state: '',
        country: ''
    });

    const addressFields = ['unit_number', 'street_number', 'street_name', 'suburb', 'post_code', 'state', 'country'];
    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    function handleSubmit(event) {
        event.preventDefault();
        if (values.password !== values.password_confirm) {
            alert("Passwords don't match");
            return;
        }

        let url = 'http://localhost:5000/teachers';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
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
                history.push('/log_in');
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

                <h2>Sign up</h2>
                <h3>Your Details</h3>
                <div className={classes.section}>
                    <TextField
                        id={'name'}
                        label={'Name'}
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange('name')}
                        autoFocus={true}
                    />
                    <TextField
                        id={'email'}
                        label={'Email'}
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange('email')}
                    />
                    <TextField
                        id={'password'}
                        label={'Password'}
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        onChange={handleChange('password')}
                    />
                    <TextField
                        id={'password_confirm'}
                        label={'Confirm Password'}
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        onChange={handleChange('password_confirm')}
                    />
                    <FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
                        <InputLabel htmlFor="adornment-amount">Standard Rate</InputLabel>
                        <Input
                            id="standard_rate"
                            value={values.standard_rate}
                            onChange={handleChange('standard_rate')}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>
                </div>

                <h3>Address</h3>
                <div className={classes.section}>
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
                </div>

                <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                    Submit
                </Button>
            </form>
        </Paper>
    )
}
