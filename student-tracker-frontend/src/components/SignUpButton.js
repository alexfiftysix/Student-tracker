import React from 'react'
import {makeStyles} from "@material-ui/core"
import Button from '@material-ui/core/Button'
import NewTeacherForm from './newTeacherForm'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles(theme => ({
    cta: {
        borderRadius: theme.spacing(5),
        color: '#f8f1e5',
        fontWeight: 'bolder',
        backgroundImage: 'linear-gradient(to bottom right, #f9ba32, #f93e82)',
        marginTop: theme.spacing(3),
        transition: '1s',
        "&:hover": {
            backgroundImage: 'linear-gradient(to bottom right, #F2B430, #F53D7F)',
        },
        textTransform: 'none'
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: theme.spacing(10),
        '& *': {
            boxShadow: 'none',
        }
    },
    button: {
        textTransform: 'none'
    }
}));

export default function SignUpButton(props) {
    // Use props.cta=true to make this into a Call To Action button (bigger and brighter)
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
            <Button className={props.cta ? classes.cta : classes.button} onClick={handleOpen}>
                {props.children}
            </Button>
            <Dialog className={classes.modal} open={open} onClose={handleClose}><NewTeacherForm/></Dialog>
        </div>
    );
}