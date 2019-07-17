import React, {useEffect} from 'react'
import Media from 'react-media'
import Typography from '@material-ui/core/Typography'
import history from './history'
import Menu from './menu'
import SignUpButton from './SignUpButton'
import LogInButton from './LogInButton'
import Button from '@material-ui/core/Button'
import config from '../config'
import {makeStyles} from "@material-ui/core";
import PropTypes from 'prop-types';
import withWidth from '@material-ui/core/withWidth';

function signOut() {
    localStorage.clear();
    history.push('/');
    window.location.assign(window.location);
}

const useStyles = makeStyles(theme => ({
    main: {
        background: 'white',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        boxShadow: '0 0 5px rgba(0,0,0,0.5)',
        '& ul': {
            listStyleType: 'none',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: 0,
            padding: 0,
            '& li': {
                margin: theme.spacing(1),
                marginBottom: theme.spacing(0.1),
                marginTop: theme.spacing(0.1),
            }
        }
    },
    hello: {
        display: 'flex',
        alignItems: 'center',
    }
}));

function TopBar(props) {
    const classes = useStyles();
    const {width} = props;
    const [data, setData] = React.useState(null);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetch(config.serverHost + 'teacher', {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
                .then(results => results.json())
                .then(data => {
                    setData(data);
                });
        }
    }, []);

    let now = new Date(Date());
    let year = now.getFullYear();
    let month = ('0' + (1 + now.getMonth())).slice(-2);
    let day = ('0' + now.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;

    if (data && data.name) {
        return (
            <header className={classes.main}>
                <ul>
                    <li>
                        <div>
                            <Menu/>
                        </div>
                    </li>
                    <li>
                        {width === 'lg' ?
                            <Button href={'/weekly/' + dateString}>Weekly View</Button>
                            :
                            <Button href={'/daily/' + dateString}>Daily View</Button>
                        }
                    </li>
                </ul>
                {width !== 'xs' ?
                    <ul>
                        <li>
                            <Button onClick={signOut}>Log out</Button>
                        </li>
                        <li className={classes.hello}><Typography>Hello {data.name}</Typography></li>
                    </ul>
                    : null}
            </header>
        )
    }

    return (
        <header className={classes.main}>
            <ul></ul>
            <ul>
                <li>
                    <LogInButton>Log In</LogInButton>
                </li>
                <li>
                    <SignUpButton>Sign Up</SignUpButton>
                </li>
            </ul>
        </header>
    )
}

TopBar.propTypes = {
    width: PropTypes.string.isRequired,
};

export default withWidth()(TopBar);
