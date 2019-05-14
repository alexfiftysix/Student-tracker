import React from 'react';
import './App.css';
import DailyView from './components/DailyView'
import WeeklyView from './components/WeeklyView'

function App() {
    return (
        <div className="App">
            {/*<DailyView/>*/}
            <WeeklyView/>
        </div>
    );
}

export default App;
