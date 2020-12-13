<template>
  <v-container fluid fill-height>
    <v-layout row wrap child-flex align-center style="position: relative;">
      <v-card>
        <h1 class="center">{{ currentCountry }}</h1>
        <h2 class="answerOK">{{ answerOK }}</h2>
        <h2 class="answerKO">{{ answerKO }}</h2>
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
      this.$socket.client.emit('roundGuess', selectedCountry.ISO_A3)
    }
  }
}
</script>
