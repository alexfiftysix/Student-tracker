import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './topBar.css'

export default function TopBar(props) {
    const teacher_id = props.teacher_id ? props.teacher_id : 1; // TODO: Get this dynamically from log in
    const [data, setData] = React.useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/teacher/' + teacher_id)
            .then(results => results.json())
            .then(data => {
                setData(data);
            });
    }, []);

    return (
        <div className={'fake-header'}>
            <header>
                <ul>
                    <li>
                        <Link to={'/weekly/1'}>home</Link>
                    </li>
                    <li>Hello, {data ? data.email : '__'}</li>
                    <li>
                        <Link to={data ? '/add_student/' + data.id : ''}>Add a student</Link>
                    </li>
                </ul>
            </header>
        </div>
    )
}
