import React, {useEffect} from 'react'
import {Link} from "react-router-dom";
import './topBar.css'
import history from './history'

function signOut() {
    localStorage.clear();
    history.push('/');
    window.location.assign(window.location);
}

function updateSchedule() {
    fetch('http://localhost:5000/my_students/update',
        {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(results => results.json())
        .then(data => {
            console.log(data);
            window.location.assign(window.location);
        });
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
    let month = ('0' + now.getMonth()).slice(-2);
    let day = ('0' + now.getDate()).slice(-2);
    let dateString = year + '-' + month + '-' + day;

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
                            <Link to={'/weekly/' + dateString}>home</Link>
                        </li>
                        <li>
                            <Link to={'/add_student'}>Add a student</Link>
                        </li>
                        <li>
                            <Link onClick={updateSchedule} to={'/weekly'}>Update Schedule</Link>
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
