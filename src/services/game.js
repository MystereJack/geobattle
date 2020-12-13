const Game = require('../models/game')
const { games, gameIdByPlayerId } = require('../db/data')

const createOrJoinGame = (gameId, player) => {
    let game = games.find((game) => game.id === gameId)
    
    // Si la game n'existe pas, on la génère
    if(!game) {
        game = new Game(gameId, player)
        games.push(game)
    }

    if(game.addPlayer(player)) {
        gameIdByPlayerId.set(player.id, game.id)
    }

    return game
}

const leaveGame = (game, playerId) => {
     // Supprimer le joueur de la partie
    game.removePlayer(playerId)
    gameIdByPlayerId.delete(playerId)
    
    // Si c'est le dernier joueur, supprimer la partie
    if(game.players.length === 0) {
        const index = games.findIndex((item) => item.id !== game.id)
        games.splice(index, 1)
    }
}

const getGameByPlayerId = (playerId) => {
    const gameId = gameIdByPlayerId.get(playerId)
    const game = games.find((game) => game.id === gameId)
    return game
}

module.exports = {
    createOrJoinGame,
    leaveGame,
    getGameByPlayerId,
}