const roundEvents = require('../constants/round')
const gameEvents = require('../constants/game')
const Round = require('../models/round')
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
            const country = initRound(game.id)
            round = new Round(
                game.id, country, country.capital[0], game.players)
            game.addRound(round)
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
                socket.emit(roundEvents.GUESS_OK, game.getCurrentRound().country.name.official)
            } else {
                roundEnded = game.getCurrentRound().closeParticipant(socket.id, isoCode, 0)
                socket.emit(roundEvents.GUESS_KO, game.getCurrentRound().country.name.official)
            }
            io.to(game.id).emit(gameEvents.LOBBY, game.showLobby())

            if(roundEnded) {
                game.endCurrentRound()
                io.to(game.id).emit(roundEvents.END)
            }
        }
    })

}

module.exports = initSockets