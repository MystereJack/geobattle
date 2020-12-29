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
@font-face {
  font-family: "FiraCode";
  src: local("FiraCode"),
   url(./fonts/FiraCode/FiraCode-Regular.ttf) format("truetype");
}
@font-face {
  font-family: "Chunk";
  src: local("Chunk"),
   url(./fonts/Chunk/Chunk.ttf) format("truetype");
}
</style>
