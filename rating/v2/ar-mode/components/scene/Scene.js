// import domUtils from '../../utils/Dom.js';
// import template from './scene.html.js';

export default {

    index: 0,

    /* TODO: create scene when needed
    createScene() {
        const n = domUtils.htmlToElement(template());
        n.setAttribute("embedded", true);
        //sceneEl.setAttribute("class", "fullscreen");
         n.style.height="700px";
         n.style.width="100%";
         return n;
    },
    */

    createFighter(data, id, view) {
        const df = document.createDocumentFragment();

        const c = document.createElement('a-entity');
        c.setAttribute('id', 'container-'+id);
        c.setAttribute('vote-marker', null);
        c.setAttribute("position", view.position);
        c.setAttribute("rotation", view.rotation);

        const f = document.createElement('a-entity');
        f.setAttribute("gltf-model", "#model-fighter-"+data.index);
        f.setAttribute("scale", "1 1 1");
        f.classList.add('clickable');
        f.setAttribute("data-id", data.id);
        c.appendChild(f);

    
        const b = document.createElement('a-image');
        b.setAttribute('color', '#fff');
        b.setAttribute('src', '/assets/remote/1.jpg');
        b.setAttribute('material', 'color: #fff; transparent: false; vertexColors: face; wireframeLinewidth: -7.23');
        b.setAttribute('height', 1);
        b.setAttribute('width', 1.5);
        b.setAttribute("position", [0, .6, .25].join(' '));
        b.classList.add('clickable');
        b.setAttribute("data-id", data.id);
        c.appendChild(b);

        const t = document.createElement('a-text');
        t.setAttribute("position", [0, 0, .6].join(' '));
        t.setAttribute('value', data.name);
        t.setAttribute('text', 'width: 10; align: center');
        c.appendChild(t);

        df.appendChild(c);
        return df;
    },

    createWaiting() {
        const t = document.createElement('a-text');
        t.setAttribute("waiting", null);
        t.setAttribute("color", 'rgb(198, 200, 121)');
        t.setAttribute("opacity", '.8');
        t.setAttribute("position", '-1.2 1.7 -1');
        t.setAttribute('value', "Waiting for next fight...");
        return t;
    }

}