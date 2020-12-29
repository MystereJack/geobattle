module.exports = function Game(id, owner) {

    this.id = id
    this.owner = owner
    this.completed = false
    this.players = []
    this.rounds = []
    this.maxRound = 10

    this.addPlayer = function(player) {
        const alreadyRegistered = this.players.filter((item) => item.id === player.id)

        if(alreadyRegistered.length === 0) {
            this.players.push(player)
            return true
        }

        return false
    }

    this.removePlayer = function(playerId) {
        this.players = this.players.filter((item) => item.id !== playerId)
    }

    this.addRound = function(round) {
        this.rounds.push(round)
    }

    this.endCurrentRound = function() {
        this.rounds.forEach((item) => item.completed = true)
    }

    this.getCurrentRound = function() {
        return this.rounds.find((item) => item.completed === false)
    }

    this.endGame = function() {
        this.completed = true
    }

    this.getScore = function(playerId) {
        const score = this.rounds
                    .flatMap((item) => item.participants)
                    .filter((item) => item.id === playerId)
                    .reduce((a,b) => a + b.points, 0)
        return score
    }

    this.addOptions = function(opts) {
        this.options = opts.options
    }

    this.showLobby = function() {
        const lobby = {
            id: this.id,
            players: [],
        }

        let self = this
        this.players.forEach((item) => {
            lobby.players.push({
                username : item.username,
                score : self.getScore(item.id)
            })
        })

        return lobby
    }

}