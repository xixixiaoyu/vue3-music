<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <router-view :style="viewStyle"></router-view>
    <player></player>
  </div>
</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'
import { mapState } from 'vuex'

export default {
  name: "App",
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle() {
      const bottom = this.playlist.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState(['playlist'])
  }
}
</script>
