<template>
  <v-container>
      <v-card>
        <v-card-title class="justify-center">LOBBY</v-card-title>
        <v-text-field
              v-model="gameURL"
              :append-icon="'mdi-content-copy'"
              label="URL"
              outlined
              class="login-form"
              @click:append="copyText"
              readonly
          ></v-text-field>
        <h3 class="login-form">Options</h3> 
        <v-row class="login-form">
          <v-col cols="4">
            <v-radio-group v-model="countryMode" column label="Continent">
              <v-radio label="World" value="World" />
              <v-radio label="Europe" value="Europe" />
              <v-radio label="Asia" value="Asia" />
              <v-radio label="Americas" value="Americas" />
              <v-radio label="Africa" value="Africa" />
              <v-radio label="Oceania" value="Oceania" />
            </v-radio-group>
          </v-col>
          <v-col cols="4">
            <v-radio-group v-model="gameMode" column class="login-form" label="Game mode">
              <v-radio label="Country" value="Country" />
              <v-radio label="Flag" value="Flag" />
              <v-radio label="Capital" value="Capital" />
            </v-radio-group>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="maxRound"
              label="Rounds"
              outlined
              class="login-form"
              type="number"
              :rules="roundRules"
            > 
            </v-text-field>
          </v-col>
        </v-row>
        <h3 class="login-form">Players</h3>
        <v-row class="login-form">
          <v-col cols="3" v-for="player in lobby.players" :key="player.id">
            <v-icon
              large
              color="indigo"
            >
              mdi-account-circle
            </v-icon>
            {{player.username}}
          </v-col>
        </v-row>
        <v-card-actions class="justify-center">
            <v-btn
                @click="doStartGame"
                class="login-button"
                width="150px"
            >
              START !
            </v-btn>
          </v-card-actions>  
      </v-card>
       <v-snackbar
        v-model="copyAlert"
        :timeout="2000"
       >
      URL has been copied !

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="copyAlert = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'Game',
  data: () => ({
    countryMode: "World",
    gameMode: "Country",
    maxRound: "10",
    lobby: "",
    gameURL: "",
    roundRules: [ 
    v => !!v || "This field is required",
    v => ( v && v > 0 ) || "Minimum one round",
    v => ( v && v < 51 ) || "Maximum 50 rounds",
    ],
    copyAlert: false
  }),
  mounted() {
    const username = this.$store.state.username
    const gameId = this.$store.state.gameId
    this.$socket.client.emit('gameJoin', { username, gameId })
  },
  sockets: {
    gameLobby(lobby) {
      this.lobby = lobby
      this.calculateURL()
    },
    gameStarted() {
      this.$router.push({ name : 'Game'})
    }
  },
  methods: {
    copyText() {
      navigator.clipboard.writeText(this.gameURL)
      this.copyAlert = true
    },
    calculateURL() {
      console.log(this.lobby)
      const path = this.$router.resolve({name : 'Start', query : {gameId: this.lobby.id}}).href
      this.gameURL = `http://${window.location.hostname}:${window.location.port}/` + path
    },
    doStartGame() {
      const options = {
        countryMode : this.countryMode,
        gameMode : this.gameMode, 
        maxRound : this.maxRound
      }
      this.$socket.client.emit('gameStart', { options })
    },
  }
}
</script>
