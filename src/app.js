const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const { createOrJoinGame, leaveGame, getGameByPlayerId, startRound, verifyCountry } = require('./core/game.js')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
})

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))
app.use(express.static(path.join(__dirname + '../node_modules')))

app.use(cors());

io.on('connection', (socket) => {
    socket.on('joinGame', ({ username, randomId }) => {
        console.log(username, randomId)
        const player = {
            id: socket.id,
            username,
            score: 0
        }

        const game = createOrJoinGame(randomId, player)        
        socket.join(game.id)
        
        const gameIdFromSocket = Array.from(socket.adapter.rooms.keys()).find((roomId) => roomId.startsWith('game_'))
        io.to(gameIdFromSocket).emit('gameStatistics', game)
    })

    socket.on('startRound', () => {
        const game = getGameByPlayerId(socket.id)
        const country = startRound(game.id)

        io.to(game.id).emit('roundStarted', {
            country
        })
    })

    socket.on('verifyCountry', (isoCode) => {
        const game = getGameByPlayerId(socket.id)
        if(game) {
            const isOK = verifyCountry(isoCode, game.id)
            
            if(isOK) {
                game.players.find((player) => player.id === socket.id).score += 1000
            }

            io.to(game.id).emit('gameStatistics', {
                game
            })
        }
    })

    socket.on('disconnect', () => {
        const game = getGameByPlayerId(socket.id)
        if(game) { 
            leaveGame(game, socket.id)

            io.to(game.id).emit('gameStatistics', {
                game
            })
        }
    })
})

module.exports = {
    server
}