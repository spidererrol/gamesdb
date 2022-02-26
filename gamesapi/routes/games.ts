import express from 'express';
import { Games } from '../models/games';
import { Vote,Owned } from '../schemas/games';
// declare module "express" {
//     interface Request {
//         myUser: any; // I don't have a type definition for User.
//     }
// }

const router = express.Router();

router.get('/', async (req, res) => {
    // let myuser = req.myUser;
    console.log("Got Request");
    try {
        const list = await Games.find();
        res.json(list);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Unknown Error" });
        }
    }
});

export default router;