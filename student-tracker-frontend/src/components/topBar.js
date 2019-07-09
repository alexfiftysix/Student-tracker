import React, {useEffect} from 'react'
import Media from 'react-media'
import './topBar.css'
import history from './history'
import Menu from './menu'
import SignUpButton from './SignUpButton'
import LogInButton from './LogInButton'
import Button from '@material-ui/core/Button'

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

    if (data && data.name) {
        return (
            <header className={'topBar'}>
                <ul>
                    <li>
                        <div>
                            <Menu/>
                        </div>
                    </li>
                    <li>
                        <Media query={'screen and (min-width: 1201px)'}>
                            <Button href={'/weekly/' + dateString}>Weekly View</Button>
                        </Media>
                        <Media query={'screen and (max-width: 1200px)'}>
                            <Button href={'/daily/' + dateString}>Daily View</Button>
                        </Media>
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
