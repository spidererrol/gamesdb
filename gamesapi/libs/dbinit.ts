import mongoose from 'mongoose';
import { log_debug } from './utils';
import  config  from "./config";

mongoose.connect(config.DATABASE_URL).catch((err: any) => { console.error('DB Error: ' + err.message); });
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.on('open', () => log_debug("Connected to database"));
