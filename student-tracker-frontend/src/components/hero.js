import React from 'react'
import {makeStyles} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link'

const useStyles = makeStyles(theme => ({
    hero: {
        color: '#f8f1e5',
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        padding: 0
    },
    title: {
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: 0,
        padding: theme.spacing(2),
        backgroundColor: '#426e86',
    },
    heading: {
        margin: 0,
        padding: 0
    },
    image: {
        height: '90vh',
        background: 'url(https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom'
    },
    cta: {
        borderRadius: theme.spacing(5),
        color: '#f8f1e5',
        fontWeight: 'bolder',
        backgroundImage: 'linear-gradient(to bottom right, #f9ba32, #f93e82)',
        marginTop: theme.spacing(3),
        transition: '1s',
        "&:hover": {
            backgroundImage: 'linear-gradient(to bottom right, #F2B430, #F53D7F)',
        }
    }
}));

export default function Hero() {
    const classes = useStyles();

    return (
        <div className={classes.hero}>
            <div className={classes.image}>
            </div>
            <div className={classes.title}>
                <h1 className={classes.heading}>Organise your students. Better.</h1>
                <h3 className={classes.heading}>
                    Rostera helps private teachers organise their lessons.
                    Make bookings, track attendance and payments, and generate invoices on the fly.
                </h3>
                <div>
                    <Button className={classes.cta} variant={'contained'} href={'/sign_up'}>
                        <h3>Get Started Today</h3>
                    </Button>
                </div>
            </div>
        </div>
    )
}