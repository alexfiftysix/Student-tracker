import React from 'react'
import clsx from 'clsx'
import {makeStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import history from "./history"
import config from '../config'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    box: {
        textAlign: 'left',
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

export default function AddressInput() {
    const classes = useStyles();

    const fields = ['unit_number', 'street_number', 'street_name', 'suburb', 'post_code', 'state', 'country'];
    const [values, setValues] = React.useState({
        country: '',
        state: '',
        suburb: '',
        post_code: '',
        street_name: '',
        street_number: '',
        unit_number: '',
    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };


    function prepare(str) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str.replace('_', ' ')
    }

    function submit() {
        const url = config.serverHost + 'address';
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
                history.push('/');
                window.location.assign(window.location);
            });
    }


    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.container, classes.flex)} noValidate autoComplete="off">

                {fields.map(f =>
                    <TextField
                        id={f}
                        key={f}
                        label={prepare(f)}
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange(f)}
                    />
                )}

                <Button variant="contained" color="primary" className={classes.button} onClick={submit}>
                    Submit
                </Button>
            </form>
        </Paper>
    );
}