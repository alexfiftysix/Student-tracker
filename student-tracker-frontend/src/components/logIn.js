import React from 'react'
import history from './history'
import clsx from 'clsx'
import currentDateAsString from '../utilities/dates'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from "@material-ui/core"
import Button from "@material-ui/core/Button"
import Paper from '@material-ui/core/Paper'
import config from '../config'
import useForm from 'react-hook-form'
import PropTypes from 'prop-types'
import withWidth from '@material-ui/core/withWidth'
import TextField from '@material-ui/core/TextField'

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

function LogIn(props) {
    const classes = useStyles();
    const {width} = props;
    const [warning, setWarning] = React.useState(null);
    const {register, handleSubmit, errors} = useForm();

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
                    if (width === 'lg' || width === 'md') {
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
                <TextField
                    placeholder={'Username'}
                    name={'username'}
                    label={errors.username ? 'Valid email is required' : 'Username'}
                    error={!!errors.username}
                    inputRef={register({
                        required: true,
                        pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                    })}
                    className={classes.textField}
                    autoFocus={true}
                />
                <TextField
                    label={'Password' + (errors.password ? ' is required' : '')}
                    error={!!errors.password}
                    name={'password'}
                    placeholder={'Password'}
                    inputRef={register({required: true})}
                    className={classes.textField}
                    type={'password'}
                />
                {errors.password && console.log(errors.password)}
                {warning ?
                    <Typography className={classes.textField} color={'error'}>{warning}</Typography>
                    : null}
                <Button
                    type={'submit'}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onTouchStart={handleSubmit}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </form>
        </Paper>
    );
}

LogIn.propTypes = {
    width: PropTypes.string.isRequired,
};

export default withWidth()(LogIn);
