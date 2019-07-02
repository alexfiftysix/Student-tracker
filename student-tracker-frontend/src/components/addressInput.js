import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
}));

export default function AddressInput() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        name: 'Cat in the Hat',
        age: '',
        multiline: 'Controlled',
        currency: 'EUR',
        country: '',

    });

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value});
    };


    const fields = ['country', 'state', 'suburb', 'post_code', 'street_name', 'street_number', 'unit_number'];

    function prepare(str) {
        str = str.charAt(0).toUpperCase() + str.slice(1);
        return str.replace('_', ' ')
    }


    return (
        <form className={classes.container} noValidate autoComplete="off">
            {fields.map(f =>
                <TextField
                    id={f}
                    label={prepare(f)}
                    className={classes.textField}
                    margin="normal"
                />
            )}
        </form>
    );
}