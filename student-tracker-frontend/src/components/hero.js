import React from 'react'
import {makeStyles} from "@material-ui/core"
import SignUpButton from './SignUpButton'

const useStyles = makeStyles(theme => ({
    hero: {
        color: '#f8f1e5',
        textShadow: '0 0 10px rgba(0,0,0,0.2)',
        width: '100%',
        minWidth: '100%',
        padding: 0,
    },
    title: {
        margin: 0,
        marginTop: theme.spacing(5),
        padding: theme.spacing(2),
        maxWidth: '500px'
    },
    heading: {
        margin: 0,
        marginTop: theme.spacing(2),
        padding: 0
    },
    image: {
        height: '90vh',
        background: 'url(https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
}));

export default function Hero() {
    const classes = useStyles();

    return (
        <div className={classes.hero}>
            <div className={classes.image}>
                <div className={classes.title}>
                    <h1 className={classes.heading}>Organise your students. Better.</h1>
                    <h3 className={classes.heading}>
                        Rostera helps private teachers organise lessons.
                        Easily book students, track attendance and payments, and generate invoices on the fly.
                    </h3>
                    <SignUpButton cta={true}><h3>GET STARTED TODAY</h3></SignUpButton>
                </div>
            </div>
        </div>
    )
}