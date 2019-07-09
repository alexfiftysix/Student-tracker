import React from 'react'
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    hero: {
        color: 'white',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
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
            </div>
        </div>
    )
}