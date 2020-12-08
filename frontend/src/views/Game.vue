<template>
  <v-container>
      <v-card>
        <v-card-title class="justify-center">GAME</v-card-title>
        <countdown ref="countdown" :time="10000" :interval="100" class="countdown">
          <template slot-scope="props" >{{ props.seconds }}.{{ Math.floor(props.milliseconds / 100) }}</template>
        </countdown>
      </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Game',
  data: () => ({

  }),
  mounted() {
    this.$refs.countdown.start()
  },
  sockets: {

  },
  methods: {

  }
}
</script>
