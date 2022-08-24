export default () => {
    return `<a-scene background="color: #FAFAFA" raycaster="objects: .clickable" cursor="rayOrigin: mouse" debug vr-mode-ui="enabled: false">
        <a-assets>
            <img id="environment" crossorigin="anonymous" src="assets/garage.jpg">

            <a-asset-item id="model-fighter-0" src="assets/avatars/legoman.gltf">
            </a-asset-item>
            <a-asset-item id="model-fighter-1" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-2" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-3" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-4" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-5" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-6" src="assets/avatars/legoman.gltf" >
            </a-asset-item>
            <a-asset-item id="model-fighter-7" src="assets/avatars/legoman.gltf" >
            </a-asset-item>

        </a-assets>
        <a-entity camera="active: true" position="0 1.6 4.8"></a-entity>
        <a-sky id="image-360" radius="10" src="#environment"
            animation__fade="property: components.material.material.color; type: color; from: #FFF; to: #000; dur: 300; startEvents: fade"
            animation__fadeback="property: components.material.material.color; type: color; from: #000; to: #FFF; dur: 300; startEvents: animationcomplete__fade">
        </a-sky>
        <a-light color="#BBB" type="ambient"></a-light>
        <!--a-light color="#3360f9" intensity="10" castShadow="true" angle="45" groundColor="#313131" type="directional" position="1.8 2.5 2"></a-light-->
        <a-light color="#3360f9" intensity="10" castshadow="true" angle="45" groundcolor="#313131" type="directional" position="0 1 1.9"></a-light>
        
        <a-gui-flex-container id="voteContainer"
            flex-direction="column" justify-content="center" align-items="normal" component-padding="0.1" 
            opacity="0.7" width="10" height="5.5"
            position="-.5 2.5 -3" rotation="0 0 0"
            panel-color="#212121"
        >
            <a-gui-icon-label-button
                width="8" height="4.5"
                onclick="testButtonAction1"
                class="clickable"
                icon="thumbs-up"
                value="label button"
                margin="0 0 0.05 0"
                active-color="#009688"
                background-color="#004D40"
                hover-color="#00695C"
                border-color="#E0F2F1"
                font-color="#E0F2F1"
                font-size="120px"
                icon-font-size="220px"
            ></a-gui-icon-label-button>

            <a-gui-flex-container 
                flex-direction="row"
                justify-content="center" align-items="normal" component-padding="0.1" 
                width="8" height="1"
                panel-color="#212121"
            >

                <a-gui-icon-label-button
                    width="2" height="0.5"
                    class="clickable"
                    onclick="testButtonAction2"
                    icon="redo"
                    value="label button"
                    margin="0 .1 0 0"
                    active-color="#009688"
                    background-color="#004D40"
                    hover-color="#00695C"
                    border-color="#E0F2F1"
                    font-color="#E0F2F1"
                    font-size="120px"
                    icon-font-size="220px"
                ></a-gui-icon-label-button>

                <a-gui-icon-label-button
                    width="2" height="0.5"
                    onclick="testButtonAction3"
                    class="clickable"
                    icon="thumbs-up"
                    value="label button"
                    margin="0 0 0 .1"
                    active-color="#009688"
                    background-color="#004D40"
                    hover-color="#00695C"
                    border-color="#E0F2F1"
                    font-color="#E0F2F1"
                    font-size="120px"
                    icon-font-size="220px"
                ></a-gui-icon-label-button>
            </a-gui-flex-container>
        </a-gui-flex-container>
    </a-scene>`;
}