import React from 'react';
import './App.css';
import WeeklyView from './components/WeeklyView'
import NewStudentForm from './components/NewStudentForm'
import Student from './components/student'
import Note from './components/note'
import AllNotesPerStudent from './components/allNotesPerStudent'
import TopBar from './components/topBar'

import {BrowserRouter as Router, Route, Link} from "react-router-dom";


function App() {
    return (
        <main className="App">
            <Router>
                <TopBar/>
                <Route path="/" exact component={WeeklyView}/>
                <Route path="/student/:student_id" component={Student}/>
                <Route path="/new_student/" component={NewStudentForm}/>
                <Route path="/student_notes/:student_id" component={AllNotesPerStudent}/>
            </Router>
        </main>
    );
}

export default App;
