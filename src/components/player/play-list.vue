<template>
  <!-- 使用teleport组件将本组件挂载到body下 -->
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide">
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll class="list-content" ref="scrollRef">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span
                  class="delete"
                  :class="{ disable: removing }"
                  @click.stop="removeSong(song)"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song'

export default {
  name: 'play-list',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup() {
    const store = useStore()
    const visible = ref(false)
    const removing = ref(false)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const confirmRef = ref(null)
    const addSongRef = ref(null)
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)
    // 复用播放模式逻辑
    const { modeIcon, changeMode, modeText } = useMode()
    // 服用收藏逻辑
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    // 监听当前歌曲变化，将新的播放歌曲滚动到列表顶部
    watch(currentSong, async newSong => {
      // 组件不展示时不操作
      if (!visible.value || !newSong.id) {
        return
      }
      // dom准备完毕再滚动
      await nextTick()
      scrollToCurrent()
    })
    // 隐藏播放列表组件
    function hide() {
      visible.value = false
    }
    // 展示播放列表组件
    async function show() {
      visible.value = true
      // 展示完成dom准备就绪时刷新滚动
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    // 点击切换歌曲
    function selectItem(song) {
      const index = playlist.value.findIndex(item => {
        return song.id === item.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }
    // 刷新滚动组件
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    // 当前歌曲是否为播放歌曲
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    // 滚动到对应组件
    function scrollToCurrent() {
      const index = sequenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      // 未找到歌曲直接返回
      if (index === -1) return
      // listRef绑定的是transition-group，要用$el获取dom
      const traget = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(traget, 300)
    }
    // 派发移除歌曲action
    function removeSong(song) {
      // 防止重复点击
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playlist.value.length) {
        hide()
      }
      // 删除动画执行300毫秒，300毫秒之后放开锁
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    // 展示清空confirm
    function showConfirm() {
      confirmRef.value.show()
    }
    // 清空播放列表
    function confirmClear() {
      store.dispatch('clearSongList')
      hide()
    }
    // 打开添加歌曲列表
    function showAddSong() {
      addSongRef.value.show()
    }
    return {
      showConfirm,
      confirmClear,
      confirmRef,
      removing,
      visible,
      playlist,
      sequenceList,
      hide,
      show,
      getCurrentIcon,
      scrollRef,
      listRef,
      selectItem,
      removeSong,
      showAddSong,
      addSongRef,
      // useMode
      modeIcon,
      changeMode,
      modeText,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>