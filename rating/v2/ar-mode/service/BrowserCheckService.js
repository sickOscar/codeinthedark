export default {

    browsers: [
        'AppleWebKit/605',
        'Version/12.0',
        'Chrome'
    ],

    isARAvailable() {
        const ua = navigator.userAgent;
        return this.browsers.some( function(item) {
            return ua.indexOf(item) > -1;
        })
    }
}