export default {

    register() {
        AFRAME.registerComponent('vote-marker', {
            init: function () {
                this.longpress = true;
                this.startTime = this.endTime = 0;
                this.el.addEventListener('mousedown', function (evt) {
                    this.endTime = 0;
                    this.longpress = true;
                    this.startTime = new Date().getTime();
                });
                this.el.addEventListener('mouseup', function (evt) {
                    this.endTime = new Date().getTime();
                    this.difftime = this.endTime - this.startTime
                });
                this.el.addEventListener('click', function (evt) {
                    if (document.getElementById('voteContainer') ||
                        document.getElementById('voteConfirm')) return false;
                    console.log('click on', evt.target.dataset.id);
                    this.longpress = (this.difftime > 0 && this.difftime <= 200) ? false : true;
                    if (!this.longpress) {
                        document.dispatchEvent(new CustomEvent(
                            "ShowVotePreview", { detail: { id: evt.target.dataset.id } }
                        ));

                    }
                    setTimeout(() => {
                        this.longpress = true;
                        this.startTime = this.endTime = 0;
                        this.difftime = 500;
                    }, 100);
                });
            }
        });
    }

}