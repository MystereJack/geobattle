const roundEvents = require('../constants/round')
const gameEvents = require('../constants/game')
const { initRound, processGuess } = require('../services/round')
const { getGameByPlayerId } = require('../services/game')

const initSockets = (io, socket) => {
    let roundInterval
    let startRoundInterval

    socket.on(roundEvents.CURRENT, () => {
        const game = getGameByPlayerId(socket.id)

        if(!game) {
            return
        }

        let round = game.getCurrentRound()

        if(!round) {
            round = initRound(game)

            let remainingStart = 3000

            startRoundInterval = setInterval(function() {
                
                remainingStart = remainingStart - 1000

                if(remainingStart == 0) {

                    let remaining = 10000
            
                    roundInterval = setInterval(function() {
                        remaining = remaining - 1000
                        console.log('REMAINING', remaining)
                        io.to(game.id).emit(roundEvents.COUNTDOWN, remaining)
            
                        if(remaining == 0) {
                            io.to(game.id).emit(roundEvents.GUESS_RESULT, game.getCurrentRound().country)
                            game.endCurrentRound()
                            io.to(game.id).emit(roundEvents.END)
                            clearInterval(roundInterval)
                        }
                    }, 1000)
                    
                    io.to(game.id).emit(roundEvents.STARTED, round)
                }
            }, 1000)
        }

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

        }
    })

}

module.exports = initSockets