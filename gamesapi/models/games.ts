import mongoose from 'mongoose';
import { UserSchema, GameSchema, LoginSchema } from '../schemas/games';

export const Users = mongoose.model('User', UserSchema);
export const Login = mongoose.model('Login', LoginSchema);
export const Games = mongoose.model('Game', GameSchema);
