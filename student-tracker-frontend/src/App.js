import React from 'react';
import './App.css';
import WeeklyView from './components/WeeklyView'
import NewStudentForm from './components/NewStudentForm'
import Student from './components/student'

function App() {
    return (
        <main className="App">
            <WeeklyView/>
            <NewStudentForm/>
            <Student id={24}/>
        </main>
    );
}

export default App;
