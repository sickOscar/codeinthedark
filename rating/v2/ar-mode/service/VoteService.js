import fightService from './FightService.js'
import voteComponent from '../components/vote/Vote.js'

export default {

    data: [],

    start() {
        document.addEventListener("ShowVotePreview", this.showVotePreview.bind(this));
    },

    vote(id) {
        console.log("vote", id)
        // TODO: call fetch and then resolve
        return Promise.resolve();
    },

    showVotePreview(evt) {
        const id = evt.detail.id;
        const detail = fightService.get(id);
        voteComponent.show(detail);
    },

    simulateStartVote(n) {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent("StartVote"));
            // this.simulateStopVote();
        }, (4000))

    },

    simulateStopVote() {
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent("ShowWaitRound"));
            // setTimeout(this.initSimulation.bind(this), 5000);
        }, 5000)
    },

    initSimulation() {
        this.simulateStartVote(5000);
    }


}