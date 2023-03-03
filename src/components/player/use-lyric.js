import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/song'
import LyricParser from 'lyric-parser'

export default function useLyric() {
  const store = useStore()
  // 获取当前播放歌曲
  const currentSong = computed(() => store.getters.currentSong)

  const currentLyric = ref("")

  watch(currentSong,async newSong => {
    if(!newSong.url || !newSong.id) {
      return
    }

    // 获取歌词
    const lyric = await getLyric(newSong)
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })

    // 歌词是异步获取的，快速切换歌曲可能会导致歌词与歌曲不匹配
    if(currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new LyricParser(lyric, handleLyric)
  })

  function handleLyric() {

  }
  return {}
}