import {validationResult} from "express-validator";

const CONST = require('./const.json')

export function ensureAdmin(req, res, next) {

    const allowedUsers = CONST.allowedUsers;
    
    if (!allowedUsers.includes(req.user.user_id)) {
        console.log('User not allowed');
        res.status(420);
        res.end();
        return;
    }

    // console.log(req.user)
    next();
}

export function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        next();
    }
}