export default (data) => {
    return `<a-entity component-padding="0.1"  position="0 2 -3" rotation="-10 0 0" panel-color="#212121" visible="" material="color: #0c0c0c; fog: false; transparent: true; opacity: 0.9" geometry="depth: 0.01; height: 8; width: 12" id="voteContainer">
            <a-text value="${data.name}" text="anchor: center; width: 12; height: 2; align: center; color: #68f19d; opacity: 0.9" position="0 3.3 0.1" scale="1.2 1.2 1.2"></a-text>
            <a-image src="${data.preview}" material="" geometry="width: 8.5; height: 4.8" position="0 0.2 0.1"></a-image>
            <a-text data-id="${data.id}" data-name="${data.name}" class="clickable confirm" width="4" height="1.7" value="Conferma" text="anchor: center; width: 10; align: center" position="-3 -3 0.1" material="shader: flat; color: #00005b; fog: false;vertexColors: vertex; blending: none" geometry="buffer: false; primitive: plane; skipCache: true; height: 0.8; width: 4"></a-text>
            <a-text class="clickable cancel" value="Annulla" text="anchor: center; width: 10; align: center" position="3 -3 0.1" material="shader: flat; color: #00005b; fog: false; vertexColors: vertex; blending: none" geometry="buffer: false; primitive: plane; skipCache: true; height: 0.8; width: 4"></a-text>
            </a-entity>`
}
