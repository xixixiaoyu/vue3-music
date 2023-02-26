<template>
  <div>
    <m-header></m-header>
    <tab></tab>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/header/header.vue'
import Tab from '@/components/tab/tab.vue'

export default {
  name: "App",
  components: {
    MHeader: Header,
    Tab
  }
}
</script>
