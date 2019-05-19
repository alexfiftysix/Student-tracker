import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";

import './App.css';
import WeeklyView from './components/WeeklyView'
import NewStudentForm from './components/NewStudentForm'
import Student from './components/student'
import AllNotesPerStudent from './components/allNotesPerStudent'
import NewNoteForm from './components/newNoteForm'
import TopBar from './components/topBar'
import LogIn from './components/logIn'
import NewTeacherFrom from './components/newTeacherForm'


function App() {
    return (
        <main className="App">
            <Router>
                <TopBar/>
                <Route path="/sign_up" component={NewTeacherFrom}/>
                <Route path="/log_in" component={LogIn}/>
                <Route path="/weekly/" component={WeeklyView}/>
                <Route path="/student/:student_id" component={Student}/>
                <Route path="/student_notes/:student_id" component={AllNotesPerStudent}/>
                <Route path="/student_add_notes/:student_id" component={NewNoteForm}/>
                <Route path="/add_student/:teacher_id" component={NewStudentForm}/>
            </Router>
        </main>
    );
}

export default App;
