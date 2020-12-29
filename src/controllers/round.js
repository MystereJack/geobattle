const roundEvents = require('../constants/round')
const gameEvents = require('../constants/game')
const { initRound, processGuess } = require('../services/round')
const { getGameByPlayerId } = require('../services/game')

const initSockets = (io, socket) => {

    socket.on(roundEvents.CURRENT, () => {
        const game = getGameByPlayerId(socket.id)

        if(!game) {
            return
        }

        let round = game.getCurrentRound()

        if(!round) {
            round = initRound(game)
        }

        io.to(game.id).emit(roundEvents.STARTED, round)
    })

    socket.on(roundEvents.GUESS, (isoCode) => {
        const game = getGameByPlayerId(socket.id)

        if(game) {
            const isOK = processGuess(isoCode, game.id)
            let roundEnded = false
            if(isOK) {
                roundEnded = game.getCurrentRound().closeParticipant(socket.id, isoCode, 1000)
            } else {
                roundEnded = game.getCurrentRound().closeParticipant(socket.id, isoCode, 0)
            }
            socket.emit(roundEvents.GUESS_RESULT, game.getCurrentRound().country)
            
            io.to(game.id).emit(gameEvents.LOBBY, game.showLobby())

            if(roundEnded) {
                game.endCurrentRound()
                io.to(game.id).emit(roundEvents.END)
            }
        }
    })

}

module.exports = initSockets