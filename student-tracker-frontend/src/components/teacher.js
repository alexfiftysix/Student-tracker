import React, {useEffect} from 'react'
import './teacher.css'
import config from '../config'

export default function Teacher(props) {
    const [data, setData] = React.useState(null);

    useEffect(() => {
        fetch(config.serverHost + 'teacher', {
            method: 'get',
            headers: {
                'x-access-token': localStorage.getItem('token'),
            }
        })
            .then(results => results.json())
            .then(data => {
                setData(data);
                console.log(data);
            });
    }, []);

    if (!data) {
        return (
            <div className={'teacher'}>Loading...</div>
        );
    }

    return (
        <div className={'teacher'}>
            <h2>{data.name}</h2>
            <p>{data.email}</p>
            <p>Standard Rate: ${data.standard_rate}</p>
        </div>
    );
}

