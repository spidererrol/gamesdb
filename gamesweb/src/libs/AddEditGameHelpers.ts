import { Key } from "react"
import { GameType } from "./types/Game"
import { PlayModeType } from "./types/PlayMode"
import { map2array, map2object, OwnershipInfo, cmp_pms, array2promisechain } from "./utils"
import { NRMap, InputRef } from "./types/InputRef"
import { EGLRef } from "../component/games/EditGameLink"
import { CloudItem } from "./types/CloudItem"
import { gamesapi } from "./gamesapi"
import { api_game, SimpleOwnershipType, VoteNames } from "./api/game"

async function save_playmode_bits(api: gamesapi, gameid: string, playmode: PlayModeType, playmodeid?: string): Promise<void> {
    let pmid = playmodeid ?? playmode._id
    await api.game.playmodeVote(gameid, pmid, playmode.myVote.vote as VoteNames)
    await api.game.playmodeOwnership(gameid, pmid, playmode.myOwner as SimpleOwnershipType)
    return
}
function save_playmode(api: gamesapi, gameid: string, playmode: PlayModeType): Promise<void> {
    if (playmode._isnew && !playmode._isdeleted) {
        // New playmode
        delete (playmode as any)["_id"] // This will be a random uuid.
        return api.game.addPlaymode(gameid, playmode).then((ret) => save_playmode_bits(api, gameid, playmode, ret.playmode._id))
    } else if (playmode._isdeleted && !playmode._isnew) {
        // Delete playmode
        return api.game.delPlaymode(gameid, playmode._id)
    } else if (playmode._isnew && playmode._isdeleted) {
        // Do nothing, created but then deleted
        return new Promise((resolve) => resolve())
    } else {
        // Modify playmode
        return api.game.updatePlaymode(gameid, playmode).then(() => save_playmode_bits(api, gameid, playmode))
    }
}

async function save_extras(api: gamesapi, game: GameType, vote: VoteNames, owned: OwnershipInfo, playmodesMap: Map<string, PlayModeType>): Promise<void> {
    const own: any = { ...owned }
    if (own.isOwned === game.myOwner?.isOwned)
        delete own["isOwned"]
    if (own.isInstalled === game.myOwner?.isInstalled)
        delete own["isInstalled"]
    if (own.maxPrice === game.myOwner?.maxPrice)
        delete own["maxPrice"]
    const playmodes = map2array(playmodesMap, (_k, p) => p).sort(cmp_pms)
    await api.game.vote(game._id, vote)
    await api.game.ownership(game._id, own)
    return array2promisechain(playmodes, (p) => save_playmode(api, game._id, p))
}
function tidyGame(usegame: any) {
    delete usegame["myOwner"]
    delete usegame["myVote"]
    delete usegame["votes"]
    delete usegame["owners"]
    delete usegame["added"]
    delete usegame["__v"]
    delete usegame["id"]
    delete usegame["_isnew"]
    delete usegame["_isdeleted"]
}
export async function do_save(
    api: gamesapi,
    game: GameType,
    aliasRefs: NRMap<HTMLInputElement>,
    linkRefs: NRMap<EGLRef>,
    tags: Map<Key, CloudItem>,
    playmodesMap: Map<string, PlayModeType>,
    refName: InputRef,
    refMinPlayers: InputRef,
    refMaxPlayers: InputRef,
    vote: string,
    owned: OwnershipInfo): Promise<string> {

    let usegame: GameType = { ...game }

    tidyGame(usegame)

    usegame.name = refName.current?.value ?? ""
    if ((refMinPlayers.current?.value ?? "").trim() === "")
        usegame.minPlayers = null

    else
        usegame.minPlayers = Number.parseFloat(refMinPlayers.current?.value ?? "1")
    if ((refMaxPlayers.current?.value ?? "").trim() === "")
        usegame.maxPlayers = null

    else
        usegame.maxPlayers = Number.parseFloat(refMaxPlayers.current?.value as string)

    usegame.aliases = map2array(aliasRefs, (_k, ref) => ref.current?.value).filter(a => a !== undefined).sort() as string[]
    usegame.tags = map2array(tags, (_k, ci) => ci.key as string).sort()
    usegame.links = map2object(linkRefs, (_k, ref) => {
        let obj: any = {}
        let key = ref.current?.name?.value ?? ""
        obj[key] = ref.current?.url?.value ?? "about:blank"
        return obj
    })
    if (game._isnew) {
        console.log("🚀 ~ file: AddEditGameHelpers.ts ~ line 94 ~ is new", game._isnew)
        delete (usegame as any)["_id"]
        const newgame = await api.game.add(usegame)
        return await save_extras(api, newgame, vote as VoteNames, owned, playmodesMap).then(() => newgame._id)
    } else {
        console.log("🚀 ~ file: AddEditGameHelpers.ts ~ line 100 ~ not new", game._isnew)
        await api.game.update(usegame)
        return await save_extras(api, usegame, vote as VoteNames, owned, playmodesMap).then(() => usegame._id)
    }
}
export function requestGame(gameapi: api_game, gameid: string, setGame: React.Dispatch<React.SetStateAction<GameType>>): Promise<void> {
    return gameapi.get(gameid as string).then(g => setGame(g))
}
