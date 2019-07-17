import React, {useEffect} from 'react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Popover from '@material-ui/core/Popover'
import config from '../config'
import {makeStyles, Typography} from "@material-ui/core"
import clsx from 'clsx'
import PropTypes from 'prop-types'
import withWidth from '@material-ui/core/withWidth'

const useStyles = makeStyles(theme => ({
    popover: {
        '& > *': {
            padding: theme.spacing(1),
            '& > *': {
                margin: theme.spacing(1),
            }

        }
    },
    booking: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        '& *': {
            margin: 0,
            // padding: 0
        },
        '& > div': {
            display: 'flex',
            // flexDirection: 'row',
            justifyContent: 'space-between',
            '& *': {
                display: 'flex',
                alignItems: 'center'
            }
        }
    },
    wide: {
        flexDirection: 'row',
    },
    notWide: {
        flexDirection: 'column',
    },
    cancelled: {
        color: 'grey',
        background: 'rgb(192,192,192)'
    },
    nameButton: {
        margin :0,
        padding: 0,
        textTransform: 'capitalize',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'flex-start'
    }
}));

function Booking(props) {
    const {width} = props;
    const classes = useStyles();
    const [state, setState] = React.useState({
        attended: props.attended,
        payed: props.payed,
        date: props.date,
        booking: props.booking
    });

    useEffect(() => {
        setState({
            attended: props.attended,
            payed: props.payed,
            date: props.date,
            cancelled: props.cancelled,
            booking: props.booking
        });
    }, [props]);

    // TODO: combine these three functions into one function?
    function changePayed() {
        let url = config.serverHost + 'my_students/payment/' + state.booking.id;
        const token = localStorage.getItem('token');
        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'x-access-token': token
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('lesson_date_time', String(state.date + '_' + state.booking.lesson_plan.lesson_time));
        if (state.payed) {
            options.body.append('amount', '0');
        } else {
            options.body.append('amount', String(state.booking.lesson_plan.price));
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);


        setState({...state, 'payed': !state.payed});
    }

    function changeAttended() {
        let url = config.serverHost + 'my_students/attendance/' + state.booking.id;
        const token = localStorage.getItem('token');

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'x-access-token': token
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('lesson_date_time', String(state.date + ' ' + state.booking.lesson_plan.lesson_time));
        options.body.append('lesson_length', String(state.booking.lesson_plan.length_minutes));
        options.body.append('attended', String(!state.attended));
        options.body.append('cancelled', String(state.cancelled));
        options.body.append('price', String(state.booking.lesson_plan.price));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        setState({...state, 'attended': !state.attended});
    }

    function changeCancelled() {
        let url = config.serverHost + 'my_students/attendance/' + state.booking.id;
        const token = localStorage.getItem('token');

        let options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'x-access-token': token
            },
            credentials: 'same-origin',
            body: new FormData()
        };

        options.body.append('lesson_date_time', String(state.date + ' ' + state.booking.lesson_plan.lesson_time));
        options.body.append('lesson_length', String(state.booking.lesson_plan.length_minutes));
        options.body.append('attended', String(state.attended));
        options.body.append('cancelled', String(!state.cancelled));
        options.body.append('price', String(state.booking.lesson_plan.price));

        fetch(url, options)
            .then(response => response.json())
            .then(data => data);

        setState({...state, 'cancelled': !state.cancelled});
    }

    // Popover stuff
    const [anchorEl, setAnchorEl] = React.useState(null);

    function openPopover(event) {
        setAnchorEl(event.currentTarget);
    }

    function closePopover() {
        setAnchorEl(null);
    }

    const open = Boolean(anchorEl);
    const id = open ? 'address-popover' : undefined;
    // end Popover stuff

    return (
        <Paper className={clsx(classes.booking, state.cancelled ? classes.cancelled : null)}>
            <div className={width !== 'lg' && classes.notWide}>
                <Button className={classes.nameButton}>
                    <Typography onClick={openPopover} variant={'h6'}>{state.booking.name}</Typography>
                </Button>
                <Popover
                    className={classes.popover}
                    id={'popover'}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {console.log(state)}
                    <Typography variant={'h5'}>Lesson details</Typography>
                    <Typography><strong>Address: </strong>{state.booking.address.printable}</Typography>
                    <Typography><strong>Email: </strong>{state.booking.email}</Typography>
                    <Typography><strong>Price: </strong>${state.booking.lesson_plan.price}</Typography>
                    <Button variant={'contained'} onClick={changeCancelled}>{state.cancelled && 'Un-'}Cancel
                        lesson</Button>
                </Popover>
                <Typography>{String(state.booking.lesson_plan.lesson_time).substr(0, 5)}-{String(state.booking.lesson_plan.end_time).substr(0, 5)}</Typography>
            </div>
            {state.cancelled ?
                <div className={width !== 'lg' && classes.notWide}>
                    <Typography>Lesson cancelled</Typography>
                </div>
                :
                <div className={width !== 'lg' && classes.notWide}>
                    <div className={'attended'}>
                        Attended
                        <Checkbox
                            checked={state.attended}
                            onChange={changeAttended}
                            color="primary"
                            value="attended"
                            inputProps={{
                                'aria-label': 'primary checkbox',
                            }}
                        />
                    </div>
                    <div>Paid
                        <Checkbox
                            checked={state.payed}
                            onChange={changePayed}
                            color="primary"
                            value="payed"
                            inputProps={{
                                'aria-label': 'primary checkbox',
                            }}
                        />
                    </div>
                </div>
            }
        </Paper>
    );
}

Booking.propTypes = {
    width: PropTypes.string.isRequired,
};

export default withWidth()(Booking);