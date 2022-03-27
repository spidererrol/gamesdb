import VoteIcon from "./VoteIcon"

type VEChangeHandler<T = Element> = (event: React.ChangeEvent<T>) => void

interface VEProps {
    vote: string,
    setter: VEChangeHandler,
}

function VoteEdit(props: VEProps) {
    return <>
        <VoteIcon vote={props.vote} />
        <select onChange={props.setter} defaultValue={props.vote}>
            <option>None</option>
            <option>Desire</option>
            <option>Accept</option>
            <option>Veto</option>

            {/* <option selected={props.vote === "None"}>None</option>
            <option selected={props.vote === "Desire"}>Desire</option>
            <option selected={props.vote === "Accept"}>Accept</option>
            <option selected={props.vote === "Veto"}>Veto</option> */}

        </select>
    </>
}

export default VoteEdit