import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import List from "./components/List";

function App() {
    const [list, setList] = useState([])

    return (
        <div className="Todo app">
            <header className="">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <main>
                <List setList={setList} list={list} />
            </main>
        </div>
    );
}

export default App;
