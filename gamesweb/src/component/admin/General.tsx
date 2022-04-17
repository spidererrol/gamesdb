import { useCallback } from "react"
import Card from "../cards/Card"
import Cards from "../cards/Cards"
import { GeneralProps } from "../props/GeneralProps"

function General(props: GeneralProps) {
    const recalcGames = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.target as HTMLButtonElement
        button.disabled = true
        props.api.admin.recalcGames().then(() => button.disabled = false)
    }, [props.api.admin])
    return <fieldset>
        <legend>Admin Controls:</legend>
        <Cards>
            <Card header="Recalculate" className="bordered" {...props}><button onClick={recalcGames}>Recalculate Games</button></Card>
        </Cards>
    </fieldset>
}

export default General