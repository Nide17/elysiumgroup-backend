const { Server } = require("socket.io");

let io = null;
let onlineUsers = [];

const CORSOptions = {
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    origin: (_req, callback) => {
        callback(null, true);
    },
    credentials: true
};

exports.initialize = (httpServer) => {
    io = new Server(httpServer, { cors: CORSOptions });

    io.on('connection', (socket) => {

        const user = socket.handshake.auth.user;

        if (!onlineUsers.some((u) => u.userID === user._id)) {
            onlineUsers.push({ userID: user._id, socketID: socket.id, username: user.name });
            io.emit('onlineUsers', onlineUsers);
        }

        socket.on('join', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on('broadcast', async (message) => {
            console.log('Broadcasting message: ', message)
            socket.broadcast.emit('broadcast', message); // Send to all users except sender
        });

        socket.on('chatroom', async ({ chatroom, message }) => {
            console.log(`Sending ${message} to ${chatroom} chatroom`)
            io.to(chatroom).timeout(5000).emit('chatroom', message); // Send to specific room
        })

        socket.on('dm', async ({ message, toSocketID }) => {
            socket.to(toSocketID).emit("dm", { message });
        });

        socket.on('disconnect', (reason) => {
            onlineUsers = onlineUsers.filter((u) => u.socketID !== socket.id);
            io.emit('onlineUsers', onlineUsers);
            console.log('A client disconnected with id = ', socket.id, " reason ==> ", reason)
        });
    })

    return io;
}