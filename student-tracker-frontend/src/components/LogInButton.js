import React from 'react'
import {makeStyles} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import LogIn from './logIn'

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(10)
    },
    button: {
        textTransform: 'none'
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
            <Button className={classes.button} variant={'contained'} onClick={handleOpen}>
                {props.children}
            </Button>
            <Modal className={classes.modal} open={open} onClose={handleClose}><LogIn/></Modal>
        </div>
    );
}