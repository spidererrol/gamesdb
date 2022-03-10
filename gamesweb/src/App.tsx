import { useState } from 'react'
import './App.css'
import Login from './component/Login'
import AuthTok from './libs/AuthTok'
import StateObj from './libs/StateObj'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './component/Home'
import Layout from './component/Layout'
import NoPage from './component/NoPage'
import { gamesapi } from './libs/gamesapi'
import Group from './component/Group'

function App() {
  // const [authTok, setAuthTok] = useState("none")
  const auth = new AuthTok(useState("none"))
  const user = new StateObj<any>(useState<any>({}))
  let api:gamesapi = new gamesapi(auth);
  // eslint-disable-next-line eqeqeq
  if (auth.get == "none") {
    return (
      <Login authTok={auth} user={user} />
    )
  }

  // https://www.w3schools.com/react/react_router.asp
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout api={api} user={user} />}>
            <Route index element={<Home api={api} />} />
            <Route path="group/:groupid" element={<Group api={api} />} />
            <Route path="*" element={<NoPage api={api} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
