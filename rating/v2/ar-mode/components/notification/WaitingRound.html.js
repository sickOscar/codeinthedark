export default (data) => {
      return `<a-entity id="waitingRound" component-padding="0.1"  width="10" height="3" position="0 2.5 -3" rotation="-10 0 0" panel-color="#212121" visible="" material="color: #0c0c0c; fog: false; transparent: true; opacity: 0.9" geometry="depth: 0.01; height: 7; width: 12" id="voteContainer">
            <a-text width="9" height="1.3" value="Waiting for\nthe next round..." text="anchor: center; width: 12; height: 2; align: center; color: #68f19d; opacity: 0.9" position="0 0 0.1" scale="2 2 2"></a-text>
      </a-entity>`
}
