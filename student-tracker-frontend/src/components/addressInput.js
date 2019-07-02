import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

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
    }
}));

export default function AddressInput() {
    const classes = useStyles();

    const fields = ['country', 'state', 'suburb', 'post_code', 'street_name', 'street_number', 'unit_number'];
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
        // TODO: Do something with this
        console.log(values);
    }


    return (
        <form className={classes.container} noValidate autoComplete="off">
            <Box className={classes.box}>
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
            </Box>
            <Button variant="contained" color="primary" className={classes.button} onClick={submit}>
                Submit
            </Button>
        </form>
    );
}