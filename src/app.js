const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const initGameSockets = require('./controllers/game')
const initRoundSockets = require('./controllers/round')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

const publicDirectoryPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(publicDirectoryPath))

app.use(cors());

io.on('connection', (socket) => {
    initGameSockets(io, socket)
    initRoundSockets(io, socket)
})

module.exports = {
    server
}