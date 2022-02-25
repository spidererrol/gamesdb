import mongoose from 'mongoose';
import { UserSchema, GameSchema } from '../schemas/games';

export const Users = mongoose.model('User',UserSchema);
export const Games = mongoose.model('Login',GameSchema);