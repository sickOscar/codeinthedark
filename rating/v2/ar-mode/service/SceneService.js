import fightService from './FightService.js'
import CONST from '../const.js';
import sceneComponent from '../components/scene/Scene.js';

export default {

    start() {
        document.addEventListener("StartVote", this.startVote.bind(this));
    },

    getSceneComponent() {
        return document.getElementById('main-scene');
    },

    startVote() {
        const frag = document.createDocumentFragment();
        const figthers = fightService.getFigthers()
        const positions = CONST.SCENE_POSITIONS.FIGHTERS['' + figthers.length];
        figthers.forEach((el, idx) => {
            el.index = idx;
            frag.appendChild(sceneComponent.createFighter(el, idx, positions[idx]));
        })
        const scene = document.querySelector('a-scene');
        scene.querySelector('#directionalLight').setAttribute('visible', 'true');
        scene.querySelectorAll("#waitingRound")
            .forEach(el => el.parentElement.removeChild(el));
        scene.appendChild(frag);
        scene.flushToDOM(true);
    },

    fullScreen() {
        /*
        if (document.documentElement.requestFullscreen) {
            const btn = document.createElement('button');
            btn.classList.add('invisible');
            btn.addEventListener('click', this._fullScreen());
            document.body.appendChild(btn);
            btn.click();
            btn.parentElement.removeChild(btn);
        } */
        return false;
    },

    _fullScreen() {
        console.log('requestFullscreen');
        setTimeout(() => {
            if (!document.fullscreenElement) {
                const elem = document.documentElement;
                const requestFullscreen = elem.requestFullscreen || elem.mozRequestFullscreen
                || elem.msRequestFullscreen || elem.webkitRequestFullscreen;
    
                requestFullscreen().then({}).catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
    
            }
    
        }, 3000);
    
    }
}