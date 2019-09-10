import express from 'express';
import http from 'http';
import socket from 'socket.io';

const iPort = process.env.PORT || 3000;
const oApp = express();
const oServer = http.createServer(oApp);
const io = socket(oServer);
const sockets = {};

oApp.use(express.static('client'));

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected.`);
    console.log(socket.handshake.query);

    if (!sockets[socket.id]) {
        sockets[socket.id] = {
            nickname: socket.handshake.query.nickname,
            x: 0,
            y: 0
        };
    }

    socket.on('mousemove', oSocket => {
        sockets[socket.id].x = oSocket.x;
        sockets[socket.id].y = oSocket.y;
        io.emit('broadcast', sockets);
    });

    socket.on('disconnect', () => {
        delete sockets[socket.id];
        io.emit('broadcast', sockets);
    });
});

oServer.listen(iPort, () => {
    console.log(`listening on *:${iPort}`);
});