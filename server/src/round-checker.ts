import {CitdEvent, Round} from "./db";
import moment from "moment";

const leftPadZero = val => val.toString().length === 2 ? val.toString() : '0' + val.toString();

export const checkRounds = async (io) => {

    let missing;
    let duration;

    const countdownRunningEvent = await CitdEvent.findOne({
        running_countdown: 1
    });

    if (countdownRunningEvent) {
        // console.log("EVENT COUNTDOWN");

        missing = moment(countdownRunningEvent.schema.event_start).diff(moment());
        duration = moment.duration(missing);

        io.sockets.emit('message', {
            type: 'EVENT_COUNTDOWN',
            data: {
                time: missing,
                missing: duration.months() + 'm ' + duration.days() + 'd ' + duration.hours() + 'h ' + leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds())
            }
        });

        return;

    }


    const nextRound = await Round.findOne({
        next: true
    });

    if (nextRound) {
        console.log('SENDING NEXT ROUND');

        missing = moment(nextRound.schema.start).diff(moment());
        duration = moment.duration(missing);


        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'ROUND_COUNTDOWN',
            data: {
                round: nextRound.schema.id,
                time: Math.floor(duration.as('seconds')),
                missing: missingString
            }
        });

        return;
    }

    const runningRound = await Round.findOne({
        running: true
    });

    if (runningRound) {
        console.log('SENDING RUNNING ROUND');

        const maxTimer = 65;

        missing = moment(runningRound.schema.end).diff(moment());
        duration = moment.duration(missing);
        let roundLength = moment(runningRound.schema.end).diff(moment(runningRound.schema.start));
        let roundDuration = moment.duration(roundLength).seconds();

        const timer:number = Math.ceil(duration / (roundDuration / maxTimer));

        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'ROUND_END_COUNTDOWN',
            data: {
                round: runningRound.schema.id,
                time: Math.floor(duration),
                missing: missingString,
                countdownStep: timer <= maxTimer ? timer : maxTimer
            }
        });

        return;
    }

    const runningVote = await Round.findOne({
        voting: true
    });

    if (runningVote) {
        console.log('SENDING VOTE RUNNING');

        missing = moment(runningVote.schema.vote_end).diff(moment());
        duration = moment.duration(missing);

        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'VOTE_COUNTDOWN',
            data: {
                round: runningVote.schema.id,
                time: Math.floor(duration.as('seconds')),
                missing: missingString
            }
        });

        return;
    }

    const showingResultsRound = await Round.findOne({
        showing_results: true
    });

    if (showingResultsRound) {
        console.log('SENDING ROUND SHOWING RESULTS');

        io.sockets.emit('message', {
            type: 'SHOWING_RESULTS',
            data: {
                round: showingResultsRound.schema.id
            }
        });

        return;
    }

    const receivingLayoutsRound = await Round.findOne({
        receiving_layouts: true
    });

    if (receivingLayoutsRound) {
        console.log('SENDING RECEIVING LAYOUTS ROUND');

        io.sockets.emit('message', {
            type: 'RECEIVING_RESULTS',
            data: {
                missing: "00:00",
                time: 0,
                round: receivingLayoutsRound.schema.id
            }
        });

    }

    const waitingRound = await Round.findOne({
        waiting: true
    });

    if (waitingRound) {
        console.log('SENDING WAITING ROUND');

        io.sockets.emit('message', {
            type: 'WAITING',
            data: {
                round: waitingRound.schema.id
            }
        });

    }

};