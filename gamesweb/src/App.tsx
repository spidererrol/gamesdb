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
import GroupPage from './component/GroupPage'
import Groups from './component/groups/Groups'
import ListGroups from './component/groups/ListGroups'
import AddGroup from './component/groups/AddGroup'
import GroupInvite from './component/groups/GroupInvite'
import { GeneralProps } from './component/props/GeneralProps'
import EditGroup from './component/groups/EditGroup'

function App() {
  // const [authTok, setAuthTok] = useState("none")
  const auth = new AuthTok(useState("none"))
  const user = new StateObj<any>(useState<any>({}))
  const dbgroups = new StateObj<number>(useState<number>(0))

  let props: GeneralProps = {
    api: new gamesapi(auth),
    dbupdates: {
      groups: dbgroups.get
    },
    dbupdate: (id: "groups") => {
      switch (id) {
        case "groups":
          dbgroups.set(dbgroups.get + 1)
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
          <Route path="/" element={<Layout {...props} user={user} logoutfunc={logout} />}>
            <Route index element={<Home {...props} />} />
            <Route path="group/:groupid" element={<GroupPage {...props} />} />
            <Route path="invite/:groupid" element={<GroupInvite {...props} />} />
            <Route path="groups" element={<Groups {...props} />}>
              <Route index element={<ListGroups {...props} />} />
              <Route path="add" element={<AddGroup {...props} />} />
              <Route path="join" element={<ListGroups {...props} />} />
              <Route path="edit/:groupid" element={<EditGroup {...props} />} />
            </Route>
            <Route path="*" element={<NoPage {...props} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
