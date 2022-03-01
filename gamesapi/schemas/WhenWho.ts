import { Schema } from 'mongoose';
import { DBBase } from '../types/DBBase';
import { UserType } from './User';

export interface WhenWhoType extends DBBase {
    when: Date;
    who: UserType;
}

export const WhenWhoSchema = new Schema({
    when: { type: Date, default: Date.now },
    who: { type: 'ObjectId', ref: 'User', autopopulate: true },
});
