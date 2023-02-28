<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
    <player></player>
  </div>
</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'
import Player from '@/components/player/player.vue'

export default {
  name: "App",
  components: {
    MHeader: Header,
    Tab,
    Player
  }
}
</script>
