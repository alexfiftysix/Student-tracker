import React, {useEffect} from 'react'
import './teacher.css'

export default function Teacher(props) {
    let username = 'amiller5656@gmail.com';
    let password = 'password';

    const [data, setData] = React.useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/user', {
            method: 'get',
            headers: {
                'Authorization': 'Basic '+btoa(username + ':' + password),
            }
        })
            .then(results => results.json())
            .then(data => {
                setData(data);
                console.log(data);
            });
    }, []);

    return (
        <div className={'teacher'}>
            Teacher goes here
        </div>
    );
}

