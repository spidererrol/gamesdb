import express from 'express'
import gamesroute from './games'
import authroute from './auth'
import userroute from './user'
import grouproute from './group'
import testroute from './test'
import auth from '../auth'
import admin from './admin'

const router = express.Router()

router.use('/auth', authroute)
router.use(auth.auth)
router.use('/coop', gamesroute)
router.use('/user', userroute)
router.use('/group', grouproute)
router.use('/test', testroute)
router.use('/admin', admin)

export default router