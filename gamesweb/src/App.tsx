import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Login from './Login'

function App() {
  const [authTok, setAuthTok] = useState("none")
  // eslint-disable-next-line eqeqeq
  if (authTok == "none") {
    return (
      <Login setAuthTok={setAuthTok} />
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
    </div>
  )
}

export default App
