import React from "react"
import { GeneralProps } from "./GeneralProps"

interface NoPageProps extends GeneralProps {
    
}
 
interface NoPageState {
    
}
 
class NoPage extends React.Component<NoPageProps, NoPageState> {
    state = {   }
    render() { 
        return (
            <>
                <h1>404</h1>
                <p>Page not found</p>
            </>
        );
    }
}
 
export default NoPage;