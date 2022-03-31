import express from 'express'
import { bindRouterPath, setupParams } from '../libs/utils'
import '../libs/type-extensions'
import * as actions from '../actions/games'
import * as playmode from '../actions/playmode'

const router = express.Router()

setupParams(router)

const bindPath = bindRouterPath.bind(null, router)

bindPath("get", "/", actions.getAllGames)

// bindPath("get", '/findname/:name', actions.getByName) // Use quick search instead.

bindPath("post", "/search", actions.searchGame)
bindPath("get", "/search/:query", actions.quickSearch)

bindPath("post", '/add', actions.addGame)
bindPath("post", "/", actions.addGame)

bindPath("get", '/votes', actions.getVoteTypes)

bindPath("post", '/:id/aliases', actions.addAlias)
bindPath("delete", '/:id/aliases', actions.deleteAlias)

bindPath("post", '/:id/tags', actions.addTag)
bindPath("delete", '/:id/tags', actions.deleteTag)

bindPath("post", '/:id/vote', actions.vote)
bindPath("patch", '/:id/vote', actions.vote)

bindPath('post', '/:id/owned', actions.setOwnership)
bindPath("patch", '/:id/owned', actions.setOwnership)

bindPath('post', '/:game/link', actions.addLink)
bindPath('patch', '/:game/link', actions.editLink)
bindPath('delete', '/:game/link', actions.delLink)

bindPath(['patch','post'],"/:game/playmode/:playmode/vote",playmode.vote)
bindPath(['patch','post'],"/:game/playmode/:playmode/owned",playmode.setOwnership)
bindPath("get", "/:game/playmode/:playmode", playmode.get)
bindPath("patch", "/:game/playmode/:playmode", playmode.update)

bindPath("post", "/:game/playmode", playmode.add)

bindPath("get", "/:game/playmodes", playmode.getAll)
bindPath("get", "/:game/playmode", playmode.getAll)

bindPath("get", '/:id', actions.getGame)

bindPath("patch", '/:id', actions.updateGame)

bindPath("delete", '/:id', actions.deleteGame)

export default router