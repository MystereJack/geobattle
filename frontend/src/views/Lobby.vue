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
        <v-col cols="12" v-for="player in game.players" :key="player.id">
          <v-icon
            large
            color="indigo"
          >
            mdi-account-circle
          </v-icon>
          {{player.username}}
        </v-col>
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
    game: "",
    gameURL: "",
    copyAlert: false
  }),
  mounted() {
    const { username, gameId } = this.$route.query
    this.$socket.client.emit('joinGame', { username, randomId: gameId })
  },
  sockets: {
    gameStatistics(game) {
      this.game = game
      console.log(game)
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
      const gameId = this.game.id.replace('game_', '')
      const path = this.$router.resolve({name : 'Start', query : {gameId}}).href
      this.gameURL = `http://${window.location.hostname}:8080/` + path
    },
    doStartGame() {
      this.$socket.client.emit('doStartGame')
    },
  }
}
</script>
