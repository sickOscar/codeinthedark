import broserCheckService from './service/BrowserCheckService.js'
import CONST from './const.js';
import './components/index.js';

function startup() {
    // try to fix device orientation and fullscreen mode
    if (screen.orientation.lock) {
        console.log('screen.orientation.lock');
        screen.orientation.lock('landscape');
    }

    // check browser
    if (broserCheckService.isARAvailable()) {
        Promise.all([
            import('./service/RegisterComponentService.js'),
            import('./service/VoteService.js'),
            import('./service/SceneService.js'),
            import('./components/notification/NotificationService.js'),
            ]
        )
        .then(([registerComponentService, voteService, sceneService, notificationService]) => {

            setTimeout( () => {
                const p = document.querySelector('.poster');
                const s = document.querySelector('a-scene');
                s.classList.remove("hidden");
                p.parentNode.removeChild(p);
                registerComponentService.default.register();
                sceneService.default.start();
                voteService.default.start()
                notificationService.default.start();

                sceneService.default.fullScreen();
                document.dispatchEvent(new CustomEvent("ShowWaitRound"));
                // simulate vote start
                setTimeout(() => {
                    console.log("start vote");
                    voteService.default.initSimulation();
                }, 3000)
            }, 3000)
        
        });

    }  else {
        location.href = CONST.APP_FALLBACK;
    }

}

window.addEventListener("load", startup, false);