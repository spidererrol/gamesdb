import UpdateMark, { UpdateState } from "./UpdateMark"
import VoteIcon from "./VoteIcon"

export type VEChangeHandler<T = Element> = (event: React.ChangeEvent<T>) => void

interface VEProps {
    vote: string,
    setter?: VEChangeHandler<HTMLSelectElement>,
    state?: UpdateState,
}

function VoteEdit(props: VEProps) {
    return <span>
        <span className="VoteEdit">
            <VoteIcon vote={props.vote} />
            <select onChange={props.setter} defaultValue={props.vote}>
                {/* <option value="None">None</option>
            <option value="Desire">Desire</option>
            <option value="Accept">Accept</option>
            <option value="Veto">Veto</option> */}

                {/* I keep getting warnings to use defaultValue instead of selected but it doesn't work! */}

                <option selected={props.vote === "None"}>None</option>
                <option selected={props.vote === "Desire"}>Desire</option>
                <option selected={props.vote === "Accept"}>Accept</option>
                <option selected={props.vote === "Dislike"}>Dislike</option>
                <option selected={props.vote === "Veto"}>Veto</option>

            </select>
        </span>
        <UpdateMark state={props.state} />
    </span>
}

export default VoteEdit