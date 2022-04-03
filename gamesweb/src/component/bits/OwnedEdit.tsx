import { useEffect, useState } from "react"
import { anyElement } from "../../libs/types/helpers"
import Loading from "./Loading"
import OwnedIcon from "./OwnedIcon"

export type OEChangeHandler<T = Element> = (event: React.ChangeEvent<T>) => void

interface OEProps {
    isOwned: boolean | null,
    isInstalled: boolean | null,
    maxPrice: number | null,
    selectSetter?: OEChangeHandler,
    priceSetter?: OEChangeHandler,
}

/**
 * 
 * @param isOwned: boolean | null If thing is currently owned
 * @param isInstalled: boolean | null If thing is currently installed
 * @param maxPrice: number | null - Maximum purchase price for thing
 * @param selectSetter: OEChangeHandler - Update installed/owned state 
 * @param priceSetter: OEChangeHandler - Update price
 */

function OwnedEdit(props: OEProps) {
    let [ownedstate, setOwnedState] = useState<string>("Unowned")
    let [maxprice_el, setMaxPriceEl] = useState<anyElement>(<Loading caller="OwnedEdit/maxprice_el" />)

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

    return <span className="OwnedEdit">
        <OwnedIcon {...props} />
        <select onChange={props.selectSetter} defaultValue={ownedstate}>
            <option selected={ownedstate === "Installed"}>Installed</option>
            <option selected={ownedstate === "Owned"}>Owned</option>
            <option selected={ownedstate === "Unowned"}>Unowned</option>
        </select>
        {maxprice_el}
    </span>
}

export default OwnedEdit