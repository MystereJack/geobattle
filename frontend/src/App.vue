<template>
  <v-app>
    <v-content>
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
  },
};
</script>

<style>
@import 'css/main.css';
</style>
