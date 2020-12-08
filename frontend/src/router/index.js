import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/start',
    name: 'Start',
    component: require('@/views/Home').default,
    meta: {
      title: 'GEOBATTLE - Start a game'
    }
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: require('@/views/Lobby').default,
    meta: {
      title: 'GEOBATTLE - Lobby'
    }
  },
  {
    path: '/game',
    name: 'Game',
    component: require('@/views/Game').default,
    meta: {
      title: 'GEOBATTLE - Game'
    }
  },
]

const router = new VueRouter({
  routes
})

const DEFAULT_TITLE = 'GEOBATTLE';
router.afterEach((to) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router
