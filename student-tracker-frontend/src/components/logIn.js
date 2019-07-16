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
import useForm from 'react-hook-form'
import Input from '@material-ui/core/Input'

const useStyles = makeStyles(theme => ({
    textField: {
        margin: theme.spacing(1),
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
    const classes = useStyles();
    const [warning, setWarning] = React.useState(null);
    const {register, handleSubmit, watch, errors} = useForm();

    const onSubmit = data => {
        // event.preventDefault();
        let url = config.serverHost + 'user';
        let options = {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic ' + btoa(data.username + ':' + data.password),
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
    };

    return (
        <Paper className={classes.paper}>
            <form onSubmit={handleSubmit(onSubmit)} className={clsx(classes.container, classes.flex)}>
                <h3>Log in</h3>
                <Input name={'username'} placeholder={'Username'}
                       inputRef={register({
                           required: true,
                           pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                       })}
                       className={classes.textField} autoFocus={true}/>
                {errors.username && errors.username.type === 'pattern' && <Typography color={'error'}>Username must be a valid email address</Typography>}
                {errors.username && errors.username.type === 'required' && <Typography color={'error'}>Username is required</Typography>}
                <Input name={'password'} placeholder={'Password'} inputRef={register({required: true})}
                       className={classes.textField}/>
                {errors.password && errors.password.type === 'required' && <Typography color={'error'}>Password is required</Typography>}
                {errors.password && console.log(errors.password)}
                {warning ?
                    <Typography className={classes.textField} color={'error'}>{warning}</Typography>
                    : null}
                <Button type={'submit'} variant="contained" color="primary" className={classes.button}
                        onTouchStart={handleSubmit} onClick={handleSubmit}
                    // disabled={!(register.username && register.password)}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    );
}