const socket = io()

// Elements
const $startRound = document.querySelector('#start-round')

// Templates
const countryDisplayTemplate = document.querySelector('#country-display-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
let { username, gameId } = Qs.parse(location.search, { ignoreQueryPrefix: true })
let roundStarted = false

// Si l'id n'est pas indiqué dans l'URL, on doit créer une nouvelle game
if(!gameId) {
    gameId = Math.floor(Math.random() * 1000000)
}

function isRoundStarted() {
    return roundStarted
}

function selectCountry(selectedCountry) {
    socket.emit('verifyCountry', selectedCountry)
}

socket.emit('joinGame', { username, randomId: gameId }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('gameStatistics', (game) => {
    const html = Mustache.render(sidebarTemplate, {
        id: game.game.id, 
        players: game.game.players
    })
    document.querySelector('#sidebar').innerHTML = html
})

socket.on('roundStarted', (country) => {
    $startRound.style.visibility = 'hidden'
    roundStarted = true
    console.log('country', country)
    const html = Mustache.render(countryDisplayTemplate, {
        country: country.country 
    })
    document.querySelector('#country-display').innerHTML = html
})

$startRound.addEventListener('click', (e) => {
    e.preventDefault()
    socket.emit('startRound')
})