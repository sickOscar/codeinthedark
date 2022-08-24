export default {

    step : 0,

    fighters: [
        {
            id: 'f1',
            name: 'fighter 1',
            preview: '/assets/remote/1.jpg'
        },
        {
            id: 'f2',
            name: 'fighter 2',
            preview: '/assets/remote/2.jpg'
        },
        {
            id: 'f3',
            name: 'fighter 3',
            preview: '/assets/remote/3.jpg'
        },
        {
            id: 'f4',
            name: 'fighter 4',
            preview: '/assets/remote/3.jpg'
        },
        {
            id: 'f5',
            name: 'fighter 5 fighter 5',
            preview: '/assets/remote/3.jpg'
        },
        {
            id: 'f6',
            name: 'fighter 6',
            preview: '/assets/remote/3.jpg'
        },
        {
            id: 'f7',
            name: 'fighter 7 long name',
            preview: '/assets/remote/3.jpg'
        },
        {
            id: 'f8',
            name: 'fighter 8',
            preview: '/assets/remote/3.jpg'
        }
    ],

    get(id) {
        return this.fighters.find( elm => elm.id == id)
    },

    getFigthers() {
        return this.fighters;
    }
}