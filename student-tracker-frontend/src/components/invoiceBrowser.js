import React, {useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {Link} from "react-router-dom"
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import config from '../config'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
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

export default function InvoiceBrowser() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        month: '',
        student: '',
        name: 'hai',
    });
    const [students, setStudents] = React.useState(null);

    function handleChange(event) {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
    }

    const months = [
        {value: 1, name: 'January'},
        {value: 2, name: 'February'},
        {value: 3, name: 'March'},
        {value: 4, name: 'April'},
        {value: 5, name: 'May'},
        {value: 6, name: 'June'},
        {value: 7, name: 'July'},
        {value: 8, name: 'August'},
        {value: 9, name: 'September'},
        {value: 10, name: 'October'},
        {value: 11, name: 'November'},
        {value: 12, name: 'December'},
    ];

    const url = config.serverHost + 'my_students';

    useEffect(() => {
        fetch(url,
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                setStudents(data);
                console.log(data);
            });
    }, [url]);

    if (!students) {
        return <h1>Loading...</h1>;
    }

    return (
        <Paper className={classes.paper}>
            <form className={clsx(classes.root, classes.flex)} autoComplete="off">
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Month</InputLabel>
                    <Select
                        value={values.month}
                        onChange={handleChange}
                        inputProps={{
                            name: 'month',
                            id: 'age-simple',
                        }}
                    >
                        {months.map(m =>
                            <MenuItem key={m.value} value={m.value}>{m.name}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Student</InputLabel>
                    <Select
                        value={values.student}
                        onChange={handleChange}
                        inputProps={{
                            name: 'student',
                            id: 'student-simple',
                        }}
                    >
                        {students.map(s =>
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        )}
                    </Select>
                </FormControl>

                {values.student && values.month ? (<Link to={'/invoice/' + values.student + '/' + values.month}>
                    <Button variant="contained" color="primary">Generate</Button>
                </Link>) : null}
            </form>
        </Paper>
    );
}
