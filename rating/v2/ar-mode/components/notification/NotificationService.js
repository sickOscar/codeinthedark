import templateVoteConfirm from './VoteConfirm.html.js'
import templateWaitingRound from './WaitingRound.html.js'

export default {

    WAIT_VOTE_CONFIRM: 5000,
    DELAY_BEFORE_WAIT_ROUND: 500,

    start() {
        document.addEventListener("ShowVoteConfirm", this.onShowVoteConfirm.bind(this))
        document.addEventListener("ShowWaitRound", this.onShowWaitRound.bind(this))
    },

    onShowVoteConfirm(evt) {
        const scene = document.querySelector('a-scene');
        scene.querySelector('#directionalLight').setAttribute('visible', 'false');
        const data = evt.detail;
        scene.insertAdjacentHTML('beforeEnd', templateVoteConfirm(data));
        scene.flushToDOM(true);
    },

    dismissVoteConfirm() {
        const el = document.querySelector('#voteConfirm');
        el.parentElement.removeChild(el);
    },

    onShowWaitRound(evt) {
        const scene = document.querySelector('a-scene');

        scene.querySelector('#directionalLight').setAttribute('visible', 'false');

        scene.insertAdjacentHTML('beforeEnd', templateWaitingRound());
        scene.querySelectorAll("[vote-marker]")
            .forEach(el => el.parentElement.removeChild(el));

        scene.querySelectorAll("#voteContainer")
            .forEach(el => el.parentElement.removeChild(el));

        scene.querySelectorAll("#voteConfirm")
            .forEach(el => el.parentElement.removeChild(el));

        scene.flushToDOM(true);
    }
}