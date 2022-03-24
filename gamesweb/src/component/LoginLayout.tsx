import { Outlet } from "react-router-dom"
import { GeneralProps } from "./props/GeneralProps"

function LoginLayout(props: GeneralProps) {
    return <Outlet />
}

export default LoginLayout