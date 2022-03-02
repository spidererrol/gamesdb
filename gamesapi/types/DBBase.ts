import mongoose from 'mongoose'

export interface DBBase {
    _id: mongoose.Types.ObjectId
    save()
}
