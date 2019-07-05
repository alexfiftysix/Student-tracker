import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Student from "./student";
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
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
        marginBottom: '2px',
        padding: '1px 5px',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'left',
        textDecoration: 'none',
        textTransform: 'capitalize'
    },
    details: {
        marginRight: theme.spacing(0.5),
        textTransform: 'capitalize',
    },
    day: {
        padding: '0 0.5em',
    },
    cancelled: {
        color: 'grey',
        textDecoration: 'line-through'
    }
}));

export default function CalendarDay(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const classes = useStyles();
    const dayNumber = props.dayNumber;
    let paddedDay = '' + dayNumber;
    if (paddedDay.length === 1) {
        paddedDay = '0' + paddedDay;
    }
    let paddedMonth = '' + props.month;
    if (paddedMonth.length === 1) {
        paddedMonth = '0' + paddedMonth;
    }

    const [students, setStudents] = React.useState([]);
    const url = 'http://localhost:5000/my_appointments/daily/2019-' + paddedMonth + '-' + paddedDay;
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
        <div className={classes.day}>
            {students.map(s =>
                <div className={classes.booking} key={s.id}>
                    <Button onClick={handleClick} className={s.cancelled ? classes.cancelled : null}>
                        <span className={classes.details}>{s.lesson_plan.lesson_time}</span>
                        <span className={classes.details}>{s.name}</span>
                        <span className={classes.details}>{s.address.suburb}</span>
                    </Button>
                    <Checkbox
                        checked={s.attended}
                        // onChange={handleChange('attended')}
                        value="attended"
                        inputProps={{
                            'aria-label': 'primary checkbox',
                        }}
                    />
                    <Checkbox
                        checked={s.payed}
                        // onChange={handleChange('payed')}
                        value="payed"
                        color="primary"
                        inputProps={{
                            'aria-label': 'secondary checkbox',
                        }}
                    />
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Student id={s.id}/>
                    </Popover>
                </div>
            )}

        </div>
    );
}