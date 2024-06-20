const { Server } = require("socket.io");

let io = null;

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
        console.log('User connected', user.name);

        socket.broadcast.emit("user connected", {
            userID: user._id,
            socketID: socket.id,
            username: user.name,
          });

        // Join chatroom
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        // Handle broadcast
        socket.on('broadcast', async (message) => {
            console.log('Broadcasting message: ', message)
            socket.broadcast.emit('broadcast', message); // Send to all users except sender
        });

        // Handle chatroom messages
        socket.on('chatroom', async ({chatroom, message}) => {
            console.log(`Sending ${message} to ${chatroom} chatroom`)
            io.to(chatroom).timeout(5000).emit('chatroom', message); // Send to specific room
        })

        // Handle DM
        socket.on('dm', async ({ message, to }) => {
            socket.to(to).emit("dm", { message, from: socket.id, });
        });

        const count = io.engine.clientsCount;
        console.log(`Number of connected clients: ${count}`);

        io.engine.on("connection_error", (err) => {
            console.log(err.req);      // the request object
            console.log(err.code);     // the error code, for example 1
            console.log(err.message);  // the error message, for example "Session ID unknown"
            console.log(err.context);  // some additional error context
        });

        socket.on('disconnect', (reason) => {
            console.log('A client disconnected with id = ', socket.id, " reason ==> ", reason)
        })
    })

    return io;
}