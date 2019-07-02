import React from 'react'
import history from './history'
import currentDateAsString from '../utilities/dates'
import TextField from '@material-ui/core/TextField';
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input"
import Invoice from "./invoice";

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));

export default function LogIn(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: '',
        password: ''
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    function submit() {
        // TODO: Do something with this
        console.log(values);
    }

    function handleSubmit(event) {
        event.preventDefault();
        let url = 'http://localhost:5000/user';
        let options = {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(values.username + ':' + values.password),
            },
            credentials: 'same-origin'
        };

        const today = currentDateAsString();

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', data['token']);
                history.push('/weekly/' + today);
                window.location.assign(window.location);
            });
    }

    return (
        <form className={classes.container} noValidate autoComplete="off">
            <TextField
                id={'username'}
                label={'Username'}
                className={classes.textField}
                margin="normal"
                onChange={handleChange('username')}
            />
            <TextField
                id={'password'}
                label={'Password'}
                className={classes.textField}
                type="password"
                margin="normal"
                onChange={handleChange('password')}
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    );
}