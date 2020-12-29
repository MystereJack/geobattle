const countries = require('world-countries')
const { games } = require('../db/data')
const Round = require('../models/round')

const initRound = (game) => {
    // Chercher un pays au hasard
    let filteredCountries = countries.filter((a) => a.independent)

    if(game.options.countryMode === 'World') {
        filteredCountries = filteredCountries
    } else {
        filteredCountries = filteredCountries.filter((a) => a.region === game.options.countryMode)
    }
    
    const countryCount = filteredCountries.length
    const randomNumber = Math.floor((Math.random() * countryCount-1))
    const selectedCountry = filteredCountries[randomNumber]

    let hint = ""
    switch(game.options.gameMode) {
        case 'Flag':
            hint = selectedCountry.cca2
            break
        case 'Country': 
            hint = selectedCountry.name.common
            break
        case 'Capital':
            hint = selectedCountry.capital[0]
            break
    }
    
    const round = new Round(
        game.id, selectedCountry, hint, game.options.gameMode, game.players)

    game.addRound(round)  
    
    return round
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