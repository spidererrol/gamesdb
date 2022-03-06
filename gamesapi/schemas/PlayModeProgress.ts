import { Schema } from 'mongoose'
import { DBBase } from '../types/DBBase'
import { PlayModeProgress } from '../types/PlayModeProgress'
import { GroupType } from './Group'
import { PlayModeSchema, PlayModeType } from './PlayMode'


export interface PlayModeProgressType extends DBBase {
    playmode: PlayModeType,
    group: GroupType,
    progress: PlayModeProgress
}

export const PlayModeProgressSchema = new Schema({
    playmode: { type: 'ObjectId', ref: 'PlayMode', autopopulate: true },
    group:  { type: 'ObjectId', ref: 'Group', autopopulate: false }, // I only expect to be retrieving this when I already know the group
    progress: { type: String, default: "Unplayed" },
})
