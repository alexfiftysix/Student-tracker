import React from 'react';
import './App.css';
import WeeklyView from './components/WeeklyView'
import NewStudentForm from './components/NewStudentForm'

function App() {
    return (
        <div className="App">
            {/*<DailyView/>*/}
            <WeeklyView/>
            <NewStudentForm/>
        </div>
    );
}

export default App;
