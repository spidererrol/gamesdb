import express from 'express'
import { bindRouterPath } from '../libs/utils'
import '../libs/type-extensions'
import * as actions from '../actions/games'

const router = express.Router()

const bindPath = bindRouterPath.bind(null, router)

bindPath("get", "/", actions.getAllGames)

// bindPath("get", '/findname/:name', actions.getByName) // Use quick search instead.

bindPath("post", "/search", actions.searchGame)
bindPath("get", "/search/:query", actions.quickSearch)

bindPath("post", '/add', actions.addGame)
bindPath("post", "/", actions.addGame)

bindPath("get", '/votes', actions.getVoteTypes)

// ##### Keep these at the end #####

bindPath("post", '/:id/aliases', actions.addAlias)

bindPath("delete", '/:id/aliases', actions.deleteAlias)

bindPath("post", '/:id/tags', actions.addTag)

bindPath("delete", '/:id/tags', actions.deleteTag)

bindPath("post", '/:id/vote', actions.vote)

bindPath("patch", '/:id/owned', actions.setOwnership)

bindPath("get", '/:id', actions.getGame)

bindPath("patch", '/:id', actions.updateGame)

bindPath("delete", '/:id', actions.deleteGame)

export default router