import { useCallback, useState } from 'react'
import './App.css'
import Login from './component/Login'
import AuthTok from './libs/AuthTok'
import StateObj from './libs/StateObj'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './component/Home'
import Layout from './component/Layout'
import NoPage from './component/NoPage'
import { gamesapi } from './libs/gamesapi'
import GroupPage from './component/groups/GroupPage'
import Groups from './component/groups/Groups'
import ListGroups from './component/groups/ListGroups'
import AddGroup from './component/groups/AddGroup'
import GroupInvite from './component/groups/GroupInvite'
import { GeneralProps } from './component/props/GeneralProps'
import EditGroup from './component/groups/EditGroup'
import Admin from './component/admin/Admin'
import RegTokens from './component/admin/RegTokens'
import GamesPage from './component/games/GamesPage'
import ListGames from './component/games/ListGames'
import AddGame from './component/games/AddGame'
import EditGame from './component/games/EditGame'
import LoginLayout from './component/LoginLayout'

function dbState(): StateObj<number> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return new StateObj<number>(useState<number>(0))
}

function App() {
  // const [authTok, setAuthTok] = useState("none")
  const auth = new AuthTok(useState("none"))
  const user = new StateObj<any>(useState<any>({}))
  const dbgroups = dbState()
  const dbregtokens = dbState()
  const dbgames = dbState()

  let props: GeneralProps = {
    api: new gamesapi(auth),
    myuser: user,
    dbupdates: {
      groups: dbgroups.get,
      regtokens: dbregtokens.get,
      games: dbgames.get
    },
    dbupdate: (id: "groups" | "regtokens" | "games") => {
      switch (id) {
        case "groups":
          dbgroups.set(dbgroups.get + 1)
          break
        case "regtokens":
          dbregtokens.set(dbregtokens.get + 1)
          break
        case "games":
          dbgames.set(dbgames.get + 1)
          break
      }
      return
    }
  }
  //TODO: Convert props to useContext?

  const logout = useCallback(async function () {
    await props.api.auth.logout()
    props.api.authtok = "none"
  }, [props.api])

  if (auth.get === "none") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginLayout {...props} />}>
            <Route index element={<Login authTok={auth} user={user} />} />
            <Route path="regtoken=:regtoken" element={<Login authTok={auth} user={user} />} />
            <Route path="*" element={<Login authTok={auth} user={user} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    )
  }

  // https://www.w3schools.com/react/react_router.asp
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout {...props} user={user} logoutfunc={logout} />}>
            <Route index element={<Home {...props} />} />
            <Route path="regtoken=:regtoken" element={<Login authTok={auth} user={user} />} />
            <Route path="group/:groupid" element={<GroupPage {...props} />} />
            <Route path="groups" element={<Groups {...props} />}>
              <Route index element={<ListGroups {...props} />} />
              <Route path="add" element={<AddGroup {...props} />} />
              <Route path="join" element={<ListGroups {...props} />} />
              <Route path=":groupid/edit" element={<EditGroup {...props} />} />
              <Route path=":groupid/invite" element={<GroupInvite {...props} />} />
            </Route>
            <Route path="games" element={<GamesPage {...props} />}>
              <Route index element={<ListGames {...props} />} {...props} />
              <Route path=":gameid/edit" element={<EditGame {...props} />} />
              <Route path="add" element={<AddGame {...props} />} />
            </Route>
            <Route path="admin" element={<Admin {...props} />}>
              <Route index element={<RegTokens {...props} />} />
              <Route path="regtokens" element={<RegTokens {...props} />} />
            </Route>
            <Route path="*" element={<NoPage {...props} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
