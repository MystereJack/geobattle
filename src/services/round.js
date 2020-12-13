const countries = require('world-countries')
const { games } = require('../db/data')

const initRound = (gameId) => {
    // Chercher un pays au hasard
    const countryCount = countries.length
    const randomNumber = Math.floor((Math.random() * countryCount-1))
    const selectedCountry = countries[randomNumber]
    
    return selectedCountry
}

const processGuess = (isoCode, gameId) => {
    const game = games.find((game) => game.id === gameId)

    if(game.getCurrentRound()) {
        return isoCode === game.getCurrentRound().country.cca3
    } 

    return false;
}

module.exports = {
    initRound,
    processGuess,
}