<template>
  <v-container fluid class="no-padding">
    <v-layout row class="no-padding flex">
        <v-row v-if="showAnswer" class="hint">
          <v-col cols="12" v-if="correctAnswer" v-bind:class="[correctAnswer ? 'answerOK' : 'answerKO']">SUCCESS !</v-col>
          <v-col cols="12" v-if="!correctAnswer" v-bind:class="[correctAnswer ? 'answerOK' : 'answerKO']">FAILED !</v-col>
          <v-row>
            <v-col cols="6">
              <v-img 
                width="300px"
                :src="require('../assets/flags/' + answer.cca2.toLowerCase() + '.png')"
              ></v-img>
            </v-col>
            <v-col cols="6">
              <h3 v-bind:class="[correctAnswer ? 'answerOK' : 'answerKO']">{{ answer.name.common.toUpperCase() }}</h3>
              <h3 v-bind:class="[correctAnswer ? 'answerOK' : 'answerKO']">{{ answer.capital[0].toUpperCase() }}</h3>
            </v-col>
          </v-row>
          <v-row class="score">
            <v-col cols="12" class="score-title">CURRENT SCORE</v-col>
            <v-col cols="12" class="score-player" v-for="player in orderedPlayers" :key="player.id">
              <v-row>
                <v-col cols="8">{{player.username.toUpperCase()}}</v-col>
                <v-col cols="4">{{player.score}}</v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>
      <v-row v-if="!showAnswer" class="hint">
        <v-col cols="12" v-if="isFlag">
          <v-img 
            width="150px"
            v-if="isFlag" 
            :src="require('../assets/flags/' + currentCountry.toLowerCase() + '.png')"
          ></v-img>
        </v-col>
        <v-col class="hint-text" v-if="!isFlag">{{ currentCountry }}</v-col>
      </v-row>
    </v-layout> 
    <v-layout row class="flex-left">

    </v-layout>
    <Map @selected="selectedCountry" />
        <!--
        <countdown ref="countdown" :time="10000" :interval="100" class="countdown">
          <template slot-scope="props" >{{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }}</template>
        </countdown>
        -->
  </v-container>
</template>

<script>
import Map from '../components/Map'

export default {
  name: 'Game',
  components: {
    Map,
  },
  data: () => ({
    isFlag: false,
    showAnswer: false,
    correctAnswer: false,
    answerStyle: "answerOK",
    currentCountry: "",
    players:"",
    answer:"",
  }),
  mounted() {
    this.$socket.client.emit('roundCurrent')
  },
  computed: {
    orderedPlayers: function() {
      return this.players.sort((a,b) => {
        return b.score - a.score
      })
    }
  },
  sockets: {
    roundStarted(result) {
      this.$store.commit('clearCountry')
      this.$store.commit('clearAnswer')
      this.isFlag = result.gameMode === 'Flag'
      this.currentCountry = result.hint
      this.showAnswer = false
    },
    roundGuessResult(answer) {
      this.$store.commit('selectAnswer', answer)
      this.answer = answer
      this.showAnswer = true
      this.correctAnswer = this.$store.state.answer.cca3 === this.$store.state.selectedCountry.sov_a3
      if(correctAnswer) {
        answerStyle = "answerOK"
      } else {
        answerStyle = "answerKO"
      }
    },
    gameLobby(lobby) {
      this.players = lobby.players
    },
    roundEnd() {
      this.$socket.client.emit('roundCurrent')
    }
  },
  methods: {
    selectedCountry(selectedCountry) {
      this.$store.commit('selectCountry', selectedCountry)
      this.$socket.client.emit('roundGuess', selectedCountry.sov_a3)
    }
  }
}
</script>
