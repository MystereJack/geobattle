const gameEvents = require('../constants/game')
const Game = require('../models/game')
const Player = require('../models/player')
const { createOrJoinGame, leaveGame, getGameByPlayerId, startRound, verifyCountry } = require('../services/game.js')

const initSockets = (io, socket) => {
    socket.on(gameEvents.JOIN, ({ username, gameId }) => {
        const player = new Player(socket.id, username)
        const game = createOrJoinGame(gameId, player)        
        socket.join(game.id)
        io.to(game.id).emit(gameEvents.LOBBY, game.showLobby())
    })

    socket.on(gameEvents.START, () => {
        const game = getGameByPlayerId(socket.id)

        // TODO : Passer la game EN_COURS = true

        io.to(game.id).emit(gameEvents.STARTED)
    })

    socket.on('disconnect', () => {
        const game = getGameByPlayerId(socket.id)
        if(game) { 
            leaveGame(game, socket.id)

            io.to(game.id).emit(gameEvents.LOBBY, game.showLobby())
        }
    })
}

module.exports = initSockets