import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import vueCountdown from '@chenfengyuan/vue-countdown'

const socket = io(process.env.VUE_APP_BACKEND_URL)
Vue.use(VueSocketIOExt, socket)
Vue.component(vueCountdown.name, vueCountdown)

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
