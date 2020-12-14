<template>
  <v-container fluid class="no-padding">
    <v-layout row class="no-padding flex">
      <v-card class="hint">
        <h3 class="center">{{ currentCountry }}</h3>
        <h4 class="answerOK">{{ answerOK }}</h4>
        <h4 class="answerKO">{{ answerKO }}</h4>
      </v-card>
    </v-layout> 
    <v-layout row class="flex-left">
      <v-card class="scores">
        <h3 class="center">SCORES</h3>
        <v-col cols="12" v-for="player in players" :key="player.id">
          <v-icon
            large
            color="indigo"
          >
            mdi-account-circle
          </v-icon>
          {{player.username}} - {{player.score}}
        </v-col>
      </v-card>
    </v-layout>
    <v-layout row class="no-padding flex">
      <Map @selected="selectedCountry" />
        <!--
        <countdown ref="countdown" :time="10000" :interval="100" class="countdown">
          <template slot-scope="props" >{{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }}</template>
        </countdown>
        -->
    </v-layout>    
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
    currentCountry: "",
    players:"",
    answerOK:"",
    answerKO:"",
  }),
  mounted() {
    this.$socket.client.emit('roundCurrent')
  },
  sockets: {
    roundStarted(result) {
      this.currentCountry = result.hint
    },
    roundGuessOK(answer) {
      this.answerKO = ""
      this.answerOK = answer
    },
    roundGuessKO(answer) {
      this.answerOK = ""
      this.answerKO = answer
    },
    gameLobby(lobby) {
      this.players = lobby.players
    },
    roundEnd() {
      console.log('ROUND END')
      this.$socket.client.emit('roundCurrent')
    }
  },
  methods: {
    selectedCountry(selectedCountry) {
      this.$socket.client.emit('roundGuess', selectedCountry.sov_a3)
    }
  }
}
</script>
