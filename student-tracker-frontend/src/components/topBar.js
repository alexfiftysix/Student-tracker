import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import './topBar.css'
import history from './history'

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

    let name = <Link to={'/log_in'}>Log In</Link>;

    if (data && data.name) {
        return (
            <div className={'fake-header'}>
                <header>
                    <ul>
                        <li>Hello, {data.name}</li>
                        <li>
                            <Link to={'/'} onClick={signOut}>Log out</Link>
                        </li>
                        <li>|</li>
                        <li>
                            <Link to={'/weekly/1'}>home</Link>
                        </li>
                        <li>
                            <Link to={data ? '/add_student/' + data.id : ''}>Add a student</Link>
                        </li>
                    </ul>
                </header>
            </div>
        )

    }

    return (
        <div className={'fake-header'}>
            <header>
                <ul>
                    <li>
                        <Link to={'/log_in'}>Log In</Link>
                    </li>
                    <li>|</li>
                    <li>
                        <Link to={'/sign_up'}>Sign Up</Link>
                    </li>
                </ul>
            </header>
        </div>
    )
}
