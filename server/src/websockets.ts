import {io} from "./server";
import * as _ from 'lodash';

const adminSockets:any[] = [];


export function createIoConnection() {
    io.on('connection', (socket: any) => {
        console.log('CONNECTION', socket.id);
        const handshakeData = socket.request;

        if (handshakeData._query['user'] === 'admin') {
            console.log("ADMIN SOCKET CONNECTION");
            adminSockets.push(socket);
        }

        for (let i = 0; i < adminSockets.length; i++) {
            adminSockets[i].emit('adminMessage', {
                type: 'SOCKET_CONNECTION'
            })
        }

        socket.on('disconnect', socket => {

            console.log("SOCKET DISCONNECTION");

            const isAdminSocket = adminSockets.find((s: any) => s.id === socket.id);
            if (isAdminSocket) {
                _.remove(adminSockets, (s: any) => s.id === socket.id);
            }

            for (let i = 0; i < adminSockets.length; i++) {
                adminSockets[i].emit('adminMessage', {
                    type: 'SOCKET_DISCONNECTION'
                })
            }
        });

    });
}

