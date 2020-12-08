const countries = require('world-countries')

const games = []
const gameIdByPlayerId = new Map()

const createOrJoinGame = (randomId, player) => {
    const index = games.findIndex((game) => game.id === 'game_' + randomId)
    let game
    // Si la game n'existe pas, on la génère
    if(index === -1) {
        game = {
            id: 'game_' + randomId,
            completed: false,
            owner: player,
            players: [],
        }
        games.push(game)
    } else {
        // Sinon on ajoute le joueur
        game = games.find((game) => game.id === 'game_' + randomId)
    }

    const playerAlready = game.players.filter((item) => item.id === player.id)
    console.log('playerAlready', playerAlready)
    if(playerAlready.length === 0) {
        console.log('playerAlready', playerAlready)
        game.players.push(player)
        gameIdByPlayerId.set(player.id, game.id)
    }

    return game
}

const leaveGame = (game, playerId) => {
     // Supprimer le joueur de la partie
    game.players = game.players.filter((player) => player.id !== playerId)
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

const startRound = (gameId) => {
    // Chercher un pays au hasard
    const countryCount = countries.length
    const randomNumber = Math.floor((Math.random() * countryCount-1))
    const selectedCountry = countries[randomNumber]
    
    // Ajouter les informations sur le round dans la game
    const game = games.find((game) => game.id === gameId)
    game.currentRound = selectedCountry

    // Retourner l'indice (nom du pays)
    return selectedCountry.capital[0]
}

const verifyCountry = (isoCode, gameId) => {
    const game = games.find((game) => game.id === gameId)
    if(game.currentRound) {
        return isoCode === game.currentRound.cca2
    } 

    return false;
}

module.exports = {
    createOrJoinGame,
    leaveGame,
    getGameByPlayerId,
    startRound,
    verifyCountry,
}