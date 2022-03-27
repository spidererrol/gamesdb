import { useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"
import Loading from "./Loading"
import OwnedIcon from "./OwnedIcon"
import VoteIcon from "./VoteIcon"

type OEChangeHandler<T = Element> = (event: React.ChangeEvent<T>) => void

interface OEProps {
    isOwned: boolean | null,
    isInstalled: boolean | null,
    maxPrice: number | null,
    selectSetter: OEChangeHandler,
    priceSetter: OEChangeHandler,
}

function OwnedEdit(props: OEProps) {
    let [ownedstate, setOwnedState] = useState<string>("Unowned")
    let [maxprice_el, setMaxPriceEl] = useState<anyElement>(<Loading />)

    useEffect(() => {
        let mpe = <></>
        if (props.isInstalled)
            setOwnedState("Installed")
        else if (props.isOwned)
            setOwnedState("Owned")
        else {
            setOwnedState("Unowned")
            mpe = <>£<input onChange={props.priceSetter} className="buyprice" type="number" step={0.01} min={0} defaultValue={props.maxPrice ?? ""} placeholder="Unset" /></>
        }
        setMaxPriceEl(mpe)
    }, [props.isInstalled, props.isOwned, props.maxPrice, props.priceSetter])

    return <>
        <OwnedIcon {...props} />
        <select onChange={props.selectSetter} defaultValue={ownedstate}>
            <option>Installed</option>
            <option>Owned</option>
            <option>Unowned</option>
        </select>
        {maxprice_el}
    </>
}

export default OwnedEdit