import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import './topBar.css'
import history from './history'
import currentDateAsString from '../utilities/dates'
import Menu from './menu'

function signOut() {
    localStorage.clear();
    history.push('/');
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
                        <Link to={'/weekly/' + dateString}>Weekly View</Link>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link to={'/home'} onClick={signOut}>Log out</Link>
                    </li>
                    <li>Hello, {data.name}</li>
                </ul>
            </header>
        )
    }

    return (
        <header className={'topBar'}>
            <ul>
                <li>
                    <Link to={'/log_in'}>Log In</Link>
                </li>
                <li>
                    <Link to={'/sign_up'}>Sign Up</Link>
                </li>
            </ul>
        </header>
    )
}
