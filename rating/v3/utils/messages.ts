export enum MessageTypes {
    ROUND_COUNTDOWN = "ROUND_COUNTDOWN",
    EVENT_COUNTDOWN = "EVENT_COUNTDOWN",
    ROUND_END_COUNTDOWN = "ROUND_END_COUNTDOWN",
    VOTE_COUNTDOWN = "VOTE_COUNTDOWN",
    SHOWING_RESULTS = "SHOWING_RESULTS",
    RECEIVING_RESULTS = "RECEIVING_RESULTS",
    WAITING = "WAITING",
}

export interface Message {
    type: string,
    data?: {
        round: number,
        missing: string,
        time: number,
    }
}