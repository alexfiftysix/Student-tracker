import React from 'react';
import './App.css';
import WeeklyView from './components/WeeklyView'
import NewStudentForm from './components/NewStudentForm'
import Student from './components/student'
import AllNotesPerStudent from './components/allNotesPerStudent'
import NewNoteForm from './components/newNoteForm'
import TopBar from './components/topBar'
import Teacher from './components/teacher'
import LogIn from './components/logIn'


import {BrowserRouter as Router, Route, Link} from "react-router-dom";




function App() {
    return (
        <main className="App">
            <Router>
                <TopBar/>
                <LogIn/>
                <Route path="/weekly/:teacher_id" component={WeeklyView}/>
                <Route path="/student/:student_id" component={Student}/>
                <Route path="/student_notes/:student_id" component={AllNotesPerStudent}/>
                <Route path="/student_add_notes/:student_id" component={NewNoteForm}/>
                <Route path="/add_student/:teacher_id" component={NewStudentForm}/>
            </Router>
        </main>
    );
}

export default App;
