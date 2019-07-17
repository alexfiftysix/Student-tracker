import React from 'react'
import history from "./history";

function signOut() {
    localStorage.clear();
    history.push('/');
    window.location.assign(window.location);
}

export default function SignOut() {
    signOut();
    return(
        <div>Signing Out...</div>
    )
}