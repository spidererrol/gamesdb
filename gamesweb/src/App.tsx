import { useState } from 'react'
import './App.css'
import Login from './Login'
import * as api from './libs/api'
import AuthTok from './libs/AuthTok'
import StateObj from './libs/StateObj'

async function logout(authTok: AuthTok) {
  await new api.auth(authTok.get).logout()
  authTok.set("none")
}

function App() {
  // const [authTok, setAuthTok] = useState("none")
  const auth = new AuthTok(useState("none"))
  const user = new StateObj<any>(useState<any>({}))
  // eslint-disable-next-line eqeqeq
  if (auth.get == "none") {
    return (
      <Login authTok={auth} user={user} />
    )
  }

  return (
    <div className="App">
      <header>
        <p>Welcome {user.get.displayName}</p>
      </header>
      <nav>

      </nav>
      <button onClick={(e) => logout(auth)}>Logout</button>
    </div>
  )
}

export default App
