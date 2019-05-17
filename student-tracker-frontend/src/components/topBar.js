import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import './topBar.css'

export default function TopBar(props) {
    return (
        <div className={'fake-header'}>
            <header>
                <ul>
                    <Link to={'/'}>
                        <li>home</li>
                    </Link>
                </ul>
            </header>
        </div>
    )
}