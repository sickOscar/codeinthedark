import * as sqlite3 from 'sqlite3';
import * as util from "util";

const databaseType = `./db.sqlite`;
export const db = new sqlite3.Database(databaseType);


db.run = util.promisify(db.run);
db.get = util.promisify(db.get);
db.all = util.promisify(db.all);

runMigrations()
    .then(() => {
        console.log('Migrations completed')
    })
    .catch(err => {
        console.log(err)
        process.exit(1)
    })

async function runMigrations() {

    // player
    await db.run(`
        CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            fullname TEXT NOT NULL,
            data TEXT
        )
    `);

    // user
    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            data TEXT
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS rounds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            layout_url TEXT NOT NULL,
            players TEXT NOT NULL,
            next INTEGER NOT NULL,
            running INTEGER NOT NULL,
            voting INTEGER NOT NULL,
            showing_results INTEGER NOT NULL,
            receiving_layouts INTEGER NOT NULL,
            start TEXT NOT NULL,
            end TEXT NOT NULL,
            vote_start TEXT NOT NULL,
            vote_end TEXT NOT NULL,
            last INTEGER NOT NULL,
            waiting INTEGER NOT NULL,
            instructions_url TEXT NOT NULL
        )
    `);

    // vote
    await db.run(`
        CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vote_for TEXT NOT NULL,
            round TEXT NOT NULL,
            voter TEXT NOT NULL,
            uuid TEXT NOT NULL
        )
    `);


    // feedback
    await db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT NOT NULL,
            data TEXT
        )
    `);

    // event
    await db.run(`
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_start TEXT NOT NULL,
            running_countdown TEXT NOT NULL,
            event_name TEXT NOT NULL
        )
    `);

}

interface ModelSchema {
    id?: string;
}

export interface UserSchema extends ModelSchema {
    uuid: string;
    data: any;
}

export interface RoundSchema extends ModelSchema {
    name: string,
    layout_url: string,
    players: string,
    next: number,
    running: number,
    voting: number,
    showing_results: number,
    receiving_layouts: number,
    start: string,
    end: string,
    vote_start: string,
    vote_end: string,
    last: number,
    waiting: number,
    instructions_url: string
}

export interface VoteSchema extends ModelSchema {
    vote_for: string,
    round: string,
    voter: string,
    uuid: string
}

export interface FeedbackSchema extends ModelSchema {
    uuid: string;
    data: any;
}

export interface CitdEventSchema extends ModelSchema {
    event_start: Date,
    running_countdown: number,
    event_name: string
}

export interface PlayerSchema extends ModelSchema {
    fullname: string,
    name: string
}

export const User = createModel<UserSchema>('users')
export const Player = createModel<PlayerSchema>('players')
export const CitdEvent = createModel<CitdEventSchema>('events')
export const Vote = createModel<VoteSchema>('votes')
export const Feedback = createModel<FeedbackSchema>('feedbacks')
export const Round = createModel<RoundSchema>('rounds')

function createModel<T extends ModelSchema>(tableName: string) {
    return class M {
        constructor(public schema: T) {
        }

        static async find(queryParams?: {[key:string]: any}): Promise<M[]> {

            const whereConditions = queryParams ? Object.keys(queryParams).map(key => {
                return `${key} = ?`
            }) : [];

            let query = `SELECT * FROM ${tableName}`;

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`
            }

            return (await db.all(
                query,
                queryParams ? Object.values(queryParams) : []
            )).map(row => new M(row))

        }

        static async findById(id: string): Promise<M> {
            return M.findOne({id: id})
        }

        static async findOne(queryParams: {[key:string]: any}): Promise<M> {
            const selected = await M.find(queryParams);
            return selected[0];
        }

        static update(params, partialModel: Partial<T>): Promise<void> {

            const whereConditions = Object.keys(params).map(key => {
                return `${key} = ?`
            })

            const setConditions = Object.keys(partialModel).map(key => {
                return `${key} = ?`
            })


            let preparedQuery = `
                UPDATE ${tableName}
                SET ${setConditions.join(', ')}
                WHERE ${whereConditions.join(',')}
            `
            const preparedParams = Object.values(partialModel).concat(Object.values(params))

            return db.run(preparedQuery, preparedParams)

        }

        static deleteOne(queryParams: {[key:string]: any}): Promise<void> {
            const whereConditions = Object.keys(queryParams).map(key => {
                return `${key} = ?`
            })
            const preparedQuery = `DELETE FROM ${tableName} WHERE ${whereConditions}`

            return db.run(preparedQuery, Object.values(queryParams))
        }

        save() {

            const columns = Object.keys(this.schema);
            const values = Object.values(this.schema).map(v => '?');
            const preparedParams = Object.values(this.schema);


            let preparedQuery = `
            INSERT INTO ${tableName} (${columns})
            VALUES (${values})
            `;

            return db.run(preparedQuery, preparedParams);
        }

        toSchema(): T {
            return this.schema
        }
    }
}







