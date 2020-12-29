import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: "",
    gameId: 0,
    selectedCountry: "",
    answer: "",
  },
  mutations: {
    initUsername(state, username) {
      state.username = username
    },
    initGameId(state, gameId) {
      state.gameId = gameId
    },
    selectCountry(state, selectedCountry) {
      state.selectedCountry = selectedCountry
    },
    clearCountry(state) {
      state.selectedCountry = ""
    },
    selectAnswer(state, answer) {
      state.answer = answer
    },
    clearAnswer(state) {
      state.answer = ""
    }
  },
  actions: {
  },
  modules: {
  }
})
