import express from 'express';
import { bindRouterPath, handleError, isKnown, log_debug, pw, reqShim } from '../libs/utils';
import { Users } from '../models/games';
import { UserType } from '../types/games';
import auth from '../auth';
import * as actions from '../actions/auth';

const router = express.Router();

const bindPath = bindRouterPath.bind(null, router);

bindPath('post','/login',actions.login);

bindPath('post','/register',actions.register);

bindPath('patch','/register',actions.update);

bindPath('get','/logout',actions.logout);

export default router;