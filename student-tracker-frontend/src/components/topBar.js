import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './topBar.css'

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
                    console.log(data);
                });
        }
    }, []);

    return (
        <div className={'fake-header'}>
            <header>
                <ul>
                    <li>
                        <Link to={'/weekly/1'}>home</Link>
                    </li>
                    <li>Hello, {data ? data.name : '__'}</li>
                    <li>
                        <Link to={data ? '/add_student/' + data.id : ''}>Add a student</Link>
                    </li>
                </ul>
            </header>
        </div>
    )
}
