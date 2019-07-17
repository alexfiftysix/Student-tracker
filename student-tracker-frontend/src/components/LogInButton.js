import React from 'react'
import {makeStyles} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import LogIn from './logIn'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& *': {
            boxShadow: 'none',
        }
    },
    button: {
        textTransform: 'none',
    }
}));

export default function LogInButton(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button className={classes.button} onClick={handleOpen}>
                {props.children}
            </Button>
            <Dialog className={classes.modal} open={open} onClose={handleClose}>
                <LogIn/>
            </Dialog>
            {/*    TODO: Expected an element that can hold a ref. Did you accidentally use a plain function component for an element instead? */}
        </div>
    );
}