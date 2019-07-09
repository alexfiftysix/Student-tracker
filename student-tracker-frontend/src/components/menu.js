import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Link from '@material-ui/core/Link';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ViewWeek from '@material-ui/icons/ViewWeek';
import ViewDay from '@material-ui/icons/ViewDay';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Payment from '@material-ui/icons/Payment';
import CalendarToday from '@material-ui/icons/CalendarToday';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function Menu() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
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
    ];

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({...state, [side]: open});
    };

    // TODO: Ge these links working!!
    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
                <List>
                {links.map((link, index) => (
                    <Link href={link.link}>
                        <ListItem button key={link.name}>
                            <ListItemIcon>{link.icon}</ListItemIcon>
                            <ListItemText primary={link.name}/>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Divider/>
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}</ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <div>
            <Button onClick={toggleDrawer('left', true)}>Open Menu</Button>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
        </div>
    );
}