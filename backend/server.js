require('dotenv').config()
console.log(process.env.NODE_ENV)
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cookieParser = require('cookie-parser');

const {Server} = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// importing Rounters
const userRouter = require('./Routes/userRouter');

server.listen(PORT, console.log("App is running on", PORT));

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

let users = {};

io.on('connection', (socket) => {

    console.log("Socket connected", socket.id);

    socket.on('disconnect', () => {
        console.log('disconnecting', socket.id);
        // delete this socket.id from users
        for (let key in users) {
            if (users[key] == socket.id) {
                console.log('User disconnected', key, socket.id);
                delete users[key];
                break;
            }
        }
        console.log("Remaining Users", users);
        socket.broadcast.emit('user-online', Object.keys(users))
    })

    // fetching online users
    socket.on('get-online-users', () => {
        console.log('fetching wait', users)
        socket.broadcast.emit('user-online', Object.keys(users))
    })

    // when a new user joined for the first time
    socket.on('user-joined', (uid) => {
        users[uid] = socket.id;
        console.log("Online Users", users)
        socket.broadcast.emit('user-online', Object.keys(users))
    })

    socket.on('logout', (uid) => {
        for (let key in users) {
            if (key == uid) {
                console.log('User disconnected', key, users[key]);
                delete users[key];
                break;
            }
        }
        socket.broadcast.emit('user-online', Object.keys(users));
    })

    // when post is created -> send to all users
    socket.on('post-created', () => {
        socket.broadcast.emit("receive-post")
    })

    // when comment is created -> send to the post owner only
    socket.on('comment-created', (postOwnerId) => {
        socket.broadcast.to(users[postOwnerId]).emit('receive-comment');
    })

    socket.on('post-liked', (postOwnerId) => {
        socket.broadcast.to(users[postOwnerId]).emit('receive-likedPost');
    })

    socket.on('started-following-user', (otherUserId) => {
        socket.broadcast.to(users[otherUserId]).emit('receive-following-request');
    })
})

app.use('/user', userRouter);

// -------------- Deployment --------------------------------

__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    // Making Build Folder as Public 
    app.use(express.static(path.join(__dirname, "/frontend/build")));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });

}

// -------------- Deployment --------------------------------