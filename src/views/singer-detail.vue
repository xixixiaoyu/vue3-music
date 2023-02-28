<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger() {
      let res = null;
      if(this.singer) {
        res = this.singer;
      }else {
        const cacheSinger = storage.session.get(SINGER_KEY);
        if(cacheSinger && cacheSinger.mid === this.$route.params.id) {
          res = cacheSinger;
        }
      }
      return res;
    },
    pic() {
      const singer = this.computedSinger;
      return singer && singer.pic;
    },
    title() {
      const singer = this.computedSinger;
      return singer && singer.name;
    }
  },
  async created() {
    if(!this.computedSinger) {
      const path = this.$route.matched[0].path;
      this.$router.push({
        path
      });
      return;
    }
    // 获取歌手详情页数据
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>