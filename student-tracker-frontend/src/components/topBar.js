import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import './topBar.css'
import history from './history'
import currentDateAsString from '../utilities/dates'
import Menu from './menu'
import SignUpButton from './SignUpButton'
import LogInButton from './LogInButton'
import Button from '@material-ui/core/Button'

function signOut() {
    localStorage.clear();
    history.push('/home');
    window.location.assign(window.location);
}

export default function TopBar(props) {
    const [data, setData] = React.useState(null);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetch('http://localhost:5000/teacher', {
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

    const today = currentDateAsString();

    if (data && data.name) {
        return (
            <header className={'topBar'}>
                <ul>
                    <l1>
                        <div>
                            <Menu/>
                        </div>
                    </l1>
                    <li>
                        <Button href={'/weekly/' + dateString}>Weekly View</Button>
                        {/*<Link to={'/weekly/' + dateString}>Weekly View</Link>*/}
                    </li>
                </ul>
                <ul>
                    <li>
                        <Button onClick={signOut}>Log out</Button>
                    </li>
                    <li><p>Hello {data.name}</p></li>
                </ul>
            </header>
        )
    }

    return (
        <header className={'topBar'}>
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
