import mongoose from 'mongoose';
import { GameSchema } from "../schemas/Game";
import { LoginSchema } from "../schemas/Login";
import { UserSchema } from "../schemas/User";

export const Users = mongoose.model('User', UserSchema);
export const Login = mongoose.model('Login', LoginSchema);
export const Games = mongoose.model('Game', GameSchema);
