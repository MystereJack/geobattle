<template>
  <v-container fluid fill-height>
    <v-layout row wrap child-flex align-center style="position: relative;">
      <v-card>
        <h1 class="center">{{ currentCountry }}</h1>
        <h2 class="answerOK">{{ answerOK }}</h2>
        <h2 class="answerKO">{{ answerKO }}</h2>
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
    answerOK:"",
    answerKO:"",
  }),
  mounted() {
    // this.$refs.countdown.start()
    this.$socket.client.emit('startRound')
    console.log('StartRound')
  },
  sockets: {
    roundStarted(result) {
      console.log('roundStarted')
      this.currentCountry = result.country
    },
    answerOK(answer) {
      console.log('AnswerOK', answer)
      this.$socket.client.emit('startRound')
      this.answerKO = ""
      this.answerOK = answer
    },
    answerKO(answer) {
      console.log('AnswerKO', answer)
      this.$socket.client.emit('startRound')
      this.answerOK = ""
      this.answerKO = answer
    }
  },
  methods: {
    selectedCountry(selectedCountry) {
      console.log('selectedCountry', selectedCountry)
      this.$socket.client.emit('selectCountry', selectedCountry.ISO_A3)
    }
  }
}
</script>
