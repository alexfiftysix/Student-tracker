import React, {useEffect, useState} from 'react'
import config from "../config"
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {makeStyles} from "@material-ui/core"
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2)
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    button: {
        marginTop: theme.spacing(1),
    },
}));

export default function StudentBrowser() {
    const classes = useStyles();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(config.serverHost + 'my_students',
            {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            .then(results => results.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            });
    }, []);

    return (
        <Paper className={classes.paper}>
            <Typography variant={'h4'}>Students</Typography>
            <div className={classes.container}>
                {students.map(s =>
                    <Button component={Link} to={'/student/' + s.id} key={s.name} className={classes.button} variant={'contained'}>{s.name}</Button>
                )}
            </div>
        </Paper>
    );
}
