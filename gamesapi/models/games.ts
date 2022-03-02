import mongoose from 'mongoose';
import { GameSchema } from "../schemas/Game";
import { GameGroupSchema } from '../schemas/GameGroup';
import { GroupSchema } from '../schemas/Group';
import { LoginSchema } from "../schemas/Login";
import { UserSchema } from "../schemas/User";
import { UserGroupSchema } from '../schemas/UserGroup';

export const Users = mongoose.model('User', UserSchema);
export const Login = mongoose.model('Login', LoginSchema);
export const Games = mongoose.model('Game', GameSchema);
export const Group = mongoose.model('Group',GroupSchema);
export const UserGroup = mongoose.model('UserGroup',UserGroupSchema);
export const GameGroup = mongoose.model('GameGroup',GameGroupSchema);
