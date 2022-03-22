import mongoose from 'mongoose'

export interface DBBase {
    _id: mongoose.Types.ObjectId
    save():any
    updateOne(...args:any):any
    toObject(...args:any):any
    toJSON(...args:any):string
}
