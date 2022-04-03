
interface LoadingProps {
    caller: string
    Loading?: string
    className?: string
}

function Loading(props: LoadingProps) {
    let LoadingText = props.Loading ?? "Loading"
    return <div className={props.className ?? "loading"}>{LoadingText}<span className="trace">({props.caller})</span>...</div>
}

export default Loading