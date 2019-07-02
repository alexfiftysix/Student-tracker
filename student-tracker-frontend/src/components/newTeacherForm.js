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
        width: 200,
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
    }
}));

export default function NewTeacherForm(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: '',
        email: '',
        password: '',
        password_confirm: '',
        standard_rate: ''
    });

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

        options.body.append('name', values.name);
        options.body.append('email', values.email);
        options.body.append('password', values.password);
        options.body.append('standard_rate', values.standard_rate);

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                history.push('/log_in');
                window.location.assign(window.location);
            });
    }

    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.container, classes.flex)} noValidate autoComplete="off">
                <h3>Sign up</h3>
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
                <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                    Submit
                </Button>
            </form>
        </Paper>
    )
}
