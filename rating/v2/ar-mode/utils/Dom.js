export default {

    /**
     * Create HTML element from html string
     * @param {string} html
     * @return Html Element
     */
    htmlToElement(html) {
        const template = document.createElement('template')
        template.innerHTML = html;
        return template.content.firstChild;
    }

}