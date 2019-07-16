import React from 'react'
import history from './history'
import clsx from 'clsx'
import currentDateAsString from '../utilities/dates'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Paper from '@material-ui/core/Paper'
import config from '../config'

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    flex: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2)
    }
}));

export default function LogIn(props) {
    // TODO: Get this and all the others to work on mobile
    // Maybe try Formik https://jaredpalmer.com/formik/
    const classes = useStyles();
    const [values, setValues] = React.useState({
        username: '',
        password: ''
    });
    const [warning, setWarning] = React.useState(null);

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };

    function handleSubmit(event) {
        event.preventDefault();
        let url = config.serverHost + 'user';
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
                // console.log(data);
                if (data.message) {
                    console.log(data.message);
                    setWarning(data.message);
                } else {
                    if (window.innerHeight > 1000) {
                        localStorage.setItem('token', data['token']);
                        history.push('/weekly/' + today);
                    } else {
                        localStorage.setItem('token', data['token']);
                        history.push('/daily/' + today);
                    }
                    window.location.assign(window.location);
                }
            });
    }

    return (
        <Paper className={classes.paper}>
            <form onSubmit={handleSubmit} className={clsx(classes.container, classes.flex)} noValidate>
                <h3>Log in</h3>
                <TextField
                    id={'username'}
                    label={'Username'}
                    className={classes.textField}
                    margin="normal"
                    onChange={handleChange('username')}
                    autoFocus={true}
                    type={'email'}
                />
                <TextField
                    id={'password'}
                    label={'Password'}
                    className={classes.textField}
                    type="password"
                    margin="normal"
                    onChange={handleChange('password')}
                />
                {warning ?
                    <Typography className={classes.textField} color={'error'}>{warning}</Typography>
                    : null}
                <Button type={'submit'} variant="contained" color="primary" className={classes.button}
                        onTouchStart={handleSubmit} onClick={handleSubmit}
                        disabled={!(values.username && values.password)}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    );
}