import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCd() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? "playing" : ""
  })

  watch(playing, newPlaying => {
    if(!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  // css动画的animation-play-state: paused 属性在ios下不生效
  // 将当前图片的旋转角度保存到外部容器
  function syncTransform(wrapper, inner) {
    const innerTransform = getComputedStyle(inner).transform
    const wrapperTransform  = getComputedStyle(wrapper).transform
    // 第一次暂停外部容器的transform为none
    wrapper.style.transform = wrapperTransform === "none" ? innerTransform : `${innerTransform} ${wrapperTransform}`
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}