import React, {useEffect, useState} from 'react'
import history from './history'
import clsx from 'clsx'
import TextField from '@material-ui/core/TextField'
import {makeStyles} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import Paper from '@material-ui/core/Paper'
import config from '../config'
import useForm from 'react-hook-form'
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        // width: '40%'
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
    const {register, handleSubmit, errors} = useForm();
    const [passwordsMatch, setPasswordsMatch] = useState(true);
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

    const teacherFields = ['name', 'email', 'password', 'password_confirm', 'standard_rate'];
    const addressFields = ['unit_number', 'street_number', 'street_name', 'suburb', 'post_code', 'state', 'country'];

    const onSubmit = data => {


        if (data.password !== data.password_confirm) {
            setPasswordsMatch(false);
            return;
        } else {
            setPasswordsMatch(true);
        }

        let url = config.serverHost + 'teachers';
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        for (const i in teacherFields) {
            options.body.append(teacherFields[i], data[teacherFields[i]]);
        }

        for (const i in addressFields) {
            options.body.append(addressFields[i], data[addressFields[i]]);
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log(data.message);
                    alert(data.message);
                } else {
                    history.push('/log_in');
                    window.location.assign(window.location);
                }
            });
    };

    function prepare(str) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str.replace('_', ' ')
    }

    useEffect(() => {
    }, [passwordsMatch]);

    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.container, classes.flex)} onSubmit={handleSubmit(onSubmit)}>
                <h2>Sign up</h2>
                <h3>Your Details</h3>
                <div className={classes.section}>
                    <TextField
                        name={'name'}
                        label={errors.name ? 'Name is required' : '* Name'}
                        className={classes.textField}
                        error={!!errors.name}
                        margin="normal"
                        autoFocus={true}
                        inputRef={register({required: true})}
                    />
                    <TextField
                        name={'email'}
                        label={errors.email ? 'Valid email is required' : '* Email'}
                        error={!!errors.email}
                        className={classes.textField}
                        margin={'normal'}
                        inputRef={register({
                            required: true,
                            pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                        })}
                    />
                    {errors.password && errors.password.type === 'pattern' && <Typography color={'error'}>Password must be at least 8 characters long, contain 1 lowercase letter, 1 uppercase letter, and 1 number</Typography>}
                    <TextField
                        name={'password'}
                        label={errors.password ? 'Password is required' : '* Password'}
                        error={!!errors.password}
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        inputRef={register({required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/})}
                    />
                    <TextField
                        name={'password_confirm'}
                        label={!passwordsMatch ? "Passwords must match" : errors.password_confirm ? 'Please confirm password' : '* Confirm Password'}
                        error={!!errors.password_confirm || !passwordsMatch}
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        inputRef={register({required: true})}
                    />
                    <FormControl fullWidth className={clsx(classes.margin, classes.textField)}>
                        <InputLabel htmlFor="adornment-amount">Standard lesson cost</InputLabel>
                        <Input
                            name="standard_rate"
                            type={'number'}
                            defaultValue={values.standard_rate}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            inputRef={register}
                        />
                    </FormControl>
                </div>

                <h3>Address</h3>
                <div className={classes.section}>
                    {addressFields.map(f =>
                        <TextField
                            name={f}
                            key={f}
                            label={prepare(f)}
                            className={classes.textField}
                            margin="normal"
                            inputRef={register}
                        />
                    )}
                </div>

                <Button type={'submit'} variant="contained" color="primary" className={classes.button}
                        onClick={onSubmit}>
                    Submit
                </Button>
            </form>
        </Paper>
    )
}
