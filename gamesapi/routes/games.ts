import express, { Request, Response } from 'express';
import { Games } from '../models/games';
import { Vote, Owned } from '../schemas/games';
import { handleError, reqShim, log_debug, isKnown } from '../libs/utils';
import { GameType, VoteType } from '../types/games';
import config from '../libs/config';
import '../libs/type-extensions';

const router = express.Router();

async function getList(query: any, limit: number = config.PAGELIMIT, res?: Response): Promise<any> {
    const list = await query.limit(limit + 1);
    const more: boolean = list.length > limit;
    const ret = { games: list.slice(0, limit), more: more };
    res?.json(ret);
    return ret;
}

router.get('/', reqShim(async (req: Request, res: Response) => {
    // let myuser = req.myUser;
    log_debug("Request all games");
    try {
        getList(Games.find(), config.PAGELIMIT, res);
    } catch (err) {
        handleError(err, res);
    }
}));

router.get('/findname/:name', reqShim(async (req: Request, res: Response) => {
    log_debug(`Find game by name (${req.params.name})`);
    try {
        getList(
            Games.find().where('name').regex(req.params.name),
            config.PAGELIMIT,
            res
        );
    } catch (err) {
        handleError(err, res);
    }
}))

router.post('/search', reqShim(async (req: Request, res: Response) => {
    log_debug(`Request game by search`);
    log_debug(req.body);
    try {
        getList(Games.find(req.body), config.PAGELIMIT, res);
    } catch (err) {
        handleError(err, res);
    }
}))

router.post('/add', reqShim(async (req: Request, res: Response) => {
    log_debug("Add new game");
    try {
        const setName = req.body.name;
        const maxPlayers = req.body.maxPlayers;
        const existing = await Games.findOne({ name: setName });
        if (isKnown(existing)) {
            res.status(400).json({
                status: "error",
                message: `Game "${setName}" already exists`,
                request: req.body,
                game: existing,
            });
            return;
        }
        const byalias = await Games.findOne({ aliases: setName });
        if (isKnown(byalias)) {
            res.status(400).json({
                status: "error",
                message: `A game with an alias of "${setName}" already exists`,
                request: req.body,
                game: byalias,
            })
            return;
        }
        const newgame = new Games({
            name: setName,
            maxPlayers: maxPlayers,
        });
        let dbGame = await newgame.save();
        res.json({ status: "success", game: dbGame });
    } catch (err) {
        handleError(err, res);
    }
}))

// ##### Keep these at the end #####

function err404(res: Response) {
    res.status(404).json({ status: "error", message: "Game not found" });
}

router.post('/:id/aliases', reqShim(async (req: Request, res: Response) => {
    log_debug('Append aliases');
    try {
        const game = await Games.findById(req.params.id);
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        log_debug(req.body);
        for (const addalias of req.body) {
            if (game.aliases.includes(addalias))
                continue;
            if (game.name == addalias) {
                res.status(409).json({ status: "error", message: `Game is already called ${addalias}` });
                return;
            }
            const othergame = await Games.findOne({ name: addalias });
            if (isKnown(othergame)) {
                res.status(409).json({ status: "error", message: `There is already a game called ${addalias}`, othergame: othergame });
                return;
            }
            const byalias = await Games.findOne({ aliases: addalias });
            if (isKnown(byalias)) {
                res.status(409).json({ status: "error", message: `There is already a game with an alias of ${addalias}`, othergame: byalias });
                return;
            }
            game.aliases.push(addalias);
        }
        let result = await game.save();
        res.json({ status: "success", game: game });
    } catch (err) {
        handleError(err, res);
    }
}))

router.delete('/:id/aliases', reqShim(async (req: Request, res: Response) => {
    log_debug('Delete aliases');
    try {
        const game = await Games.findById(req.params.id);
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        log_debug(req.body);
        game.aliases = game.aliases.filter((alias: string) => !req.body.includes(alias));
        let result = await game.save();
        res.json({ status: "success", game: game });
    } catch (err) {
        handleError(err, res);
    }
}))

router.post('/:id/tags', reqShim(async (req: Request, res: Response) => {
    log_debug('Append tags');
    try {
        const game = await Games.findById(req.params.id);
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        log_debug(req.body);
        for (const addtag of req.body) {
            if (game.tags.includes(addtag))
                continue;
            game.tags.push(addtag);
        }
        let result = await game.save();
        res.json({ status: "success", game: game });
    } catch (err) {
        handleError(err, res);
    }
}))

router.delete('/:id/tags', reqShim(async (req: Request, res: Response) => {
    log_debug('Delete tags');
    try {
        const game = await Games.findById(req.params.id);
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        log_debug(req.body);
        game.tags = game.tags.filter((tag: string) => !req.body.includes(tag));
        let result = await game.save();
        res.json({ status: "success", game: game });
    } catch (err) {
        handleError(err, res);
    }
}))

router.post('/:id/vote', reqShim(async (req: Request, res: Response) => {
    log_debug(`Voting for ${req.params.id}`);
    try {
        const game = await Games.findById(req.params.id).populate("votes");
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        let newvote: string = req.body.vote;
        let myvote;
        for (const vote of game.votes) {
            // log_debug(`Vote: ${vote.user._id} == ${req.myUser._id}`);
            if (vote.user._id.toString() == req.myUser._id.toString()) {
                // log_debug("Hit existing vote");
                myvote = vote;
                break;
            }
        }
        if (isKnown(myvote)) {
            myvote.vote = newvote;//Vote[newvote as keyof typeof Vote];
            myvote.when = new Date();
            // myvotes[0].save();
            // log_debug("Updated vote: " + myvote);
        } else {
            let vote = game.votes.push({
                user: req.myUser._id,
                when: new Date(),
                vote: newvote,//Vote[newvote as keyof typeof Vote],
            });
            // log_debug("Added vote: " + vote);
            // vote.save();
        }
        let result = game.save();
        // let newgame = await Games.findById(req.params.id).populate("votes");
        res.json({
            status: "success",
            game: game,
            result: result,
            //    after: newgame
        });
    } catch (err) {
        handleError(err, res);
    }
}))

router.get('/:id', reqShim(async (req: Request, res: Response) => {
    log_debug(`Request one game (${req.params.id})`);
    try {
        const game = await Games.findById(req.params.id);
        if (isKnown(game)) {
            res.json({ status: "success", game: game });
        } else {
            err404(res);
        }
    } catch (err) {
        handleError(err, res);
    }
}));

router.patch('/:id', reqShim(async (req: Request, res: Response) => {
    log_debug(`Update game (${req.params.id})`);
    try {
        const game = await Games.findById(req.params.id);
        if (!isKnown(game)) {
            err404(res);
            return;
        }
        delete req.body._id; // I don't know what would happen if you updated this but I suspect it would be bad!
        let result = await game.updateOne({
            "$set": req.body
        });
        const after = await Games.findById(req.params.id);
        res.json({ status: "success", result: result, before: game, after: after });
    } catch (err) {
        handleError(err, res);
    }
}))

router.delete('/:id', reqShim(async (req: Request, res: Response) => {
    log_debug(`Delete game (${req.params.id})`);
    try {
        const before = await Games.findById(req.params.id);
        if (!isKnown(before)) {
            err404(res);
            return;
        }
        const result = await Games.findByIdAndDelete(req.params.id);
        const after = await Games.findById(req.params.id);
        res.json({ status: "success", result: result, before: before, after: after });
    } catch (err) {
        handleError(err, res);
    }
}))

export default router;