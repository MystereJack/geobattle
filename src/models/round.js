module.exports = function Round(gameId, country, hint, players) {
    this.gameId = gameId
    this.country = country
    this.hint = hint
    this.participants = []
    this.completed = false

    let self = this
    players.forEach(function(item) {
        self.participants.push({
            id: item.id,
            guess: '',
            points: 0
        })
    })

    this.closeParticipant = function(playerId, guess, points) {
        this.participants.find((item) => item.id === playerId).points += points
        this.participants.find((item) => item.id === playerId).guess = guess
        
        if(this.participants.filter((item) => item.guess === '').length === 0) {
            return true
        }

        return false
    }

}