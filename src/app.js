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

const publicDirectoryPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(publicDirectoryPath))

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

    socket.on('doStartGame', () => {
        const game = getGameByPlayerId(socket.id)

        // TODO : Passer la game EN_COURS = true

        io.to(game.id).emit('gameStarted')
    })

    socket.on('startRound', () => {
        const game = getGameByPlayerId(socket.id)
        const country = startRound(game.id)

        io.to(game.id).emit('roundStarted', {
            country
        })
    })

    socket.on('selectCountry', (isoCode) => {
        const game = getGameByPlayerId(socket.id)
        if(game) {
            const isOK = verifyCountry(isoCode, game.id)
            
            if(isOK) {
                socket.emit('answerOK', game.currentRound.name.official)
            } else {
                socket.emit('answerKO', game.currentRound.name.official)
            }
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