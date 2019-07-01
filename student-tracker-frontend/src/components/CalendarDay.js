import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    dateNumber: {
        color: 'black',
        textAlign: 'left',
    },
    booking: {
        backgroundColor: 'rgb(0, 191, 255)',
        border: '1px solid white',
        padding: '5px',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
    }
});

export default function CalendarDay(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const dayNumber = props.dayNumber;

    const [students, setStudents] = React.useState([]);
    const url = 'http://localhost:5000/my_appointments/daily/2019-07-02';
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


    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.dateNumber} variant="h5" component="h2">
                    {dayNumber}
                </Typography>
                {students.map(s =>
                    <Typography className={classes.booking}>
                        <span>{s.name}</span>
                        <span>{s.lesson_plan.lesson_time}</span>
                    </Typography>
                )}

            </CardContent>
        </Card>
    );
}