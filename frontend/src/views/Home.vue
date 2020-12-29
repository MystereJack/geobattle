<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-card height="50%" width="50%">
        <v-card-title class="justify-center">WELCOME TO GEOBATTLE</v-card-title>
        <v-form>
          <v-text-field
              v-model="username"
              label="Username"
              outlined
              class="login-form"
          ></v-text-field>
          <v-card-actions class="justify-center">
            <v-btn
                @click="startGame"
                class="login-button"
                width="150px"
            >
              {{btnText}}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    username: "",
    gameId: "",
    btnText: "CREATE A GAME"
  }),
  mounted() {
    this.gameId = parseInt(this.$route.query.gameId)

    if(this.gameId) {
      this.btnText = "JOIN THE GAME"
    } else {
      this.btnText = "CREATE A GAME"
    }

    if(!this.gameId) {
      this.gameId = Math.floor(Math.random() * 1000000)
    }
  },
  methods: {
    startGame() {
      this.$store.commit('initUsername', this.username)
      this.$store.commit('initGameId', this.gameId)
      this.$router.push({ name : 'Lobby' })
    }
  },
}
</script>
