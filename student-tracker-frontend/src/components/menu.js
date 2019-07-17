import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Link from '@material-ui/core/Link'
import ListItemText from '@material-ui/core/ListItemText'

import ListItemIcon from '@material-ui/core/ListItemIcon'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ViewWeek from '@material-ui/icons/ViewWeek'
import ViewDay from '@material-ui/icons/ViewDay'
import PersonAdd from '@material-ui/icons/PersonAdd'
import Payment from '@material-ui/icons/Payment'
import CalendarToday from '@material-ui/icons/CalendarToday'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToApp from '@material-ui/icons/ExitToApp'

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default function Menu() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
    });

    const now = new Date(Date());
    const year = now.getFullYear();
    const month = ('0' + (1 + now.getMonth())).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const dateString = year + '-' + month + '-' + day;

    const links = [
        {
            name: 'Me',
            link: '/me',
            icon: <AccountCircle/>
        },
        {
            name: 'Weekly View',
            link: '/weekly/' + dateString,
            icon: <ViewWeek/>
        },
        {
            name: 'Daily View',
            link: '/daily/' + dateString,
            icon: <ViewDay/>
        },
        {
            name: 'Add Student',
            link: '/add_student',
            icon: <PersonAdd/>
        },
        {
            name: 'Invoices',
            link: '/invoices',
            icon: <Payment/>
        },
        {
            name: 'Calender',
            link: '/calendar',
            icon: <CalendarToday/>
        },
        {
            name: 'Sign Out',
            link: '/signout',
            icon: <ExitToApp/>
        }
    ];

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [side]: open});
    };

    // TODO: Get drawer swipeable
    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
                <List>
                {links.map((link, index) => (
                    <Link key={link.name} href={link.link}>
                        <ListItem button key={link.name}>
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.name}/>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            <Button onClick={toggleDrawer('left', true)}><MenuIcon/></Button>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
        </div>
    );
}