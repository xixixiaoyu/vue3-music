import BScroll from '@better-scroll/core'
import PullUp from '@better-scroll/pull-up'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(PullUp)
BScroll.use(ObserveDOM)

export default function usePullUpLoad(requestData) {
  const scroll = ref(null)
  const rootRef = ref(null)
  const isPullUpLoad = ref(false)

  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(rootRef.value, {
      pullUpLoad: true,
      observeDOM: true,
      click: true
    }))
    // 监听pullingUp上拉加载事件
    scrollVal.on('pullingUp', pullingUpHandler)

    // 上拉加载回调
    async function pullingUpHandler() {
      isPullUpLoad.value = true
      await requestData()
      // 结束上拉，刷新scroll实例
      scrollVal.finishPullUp()
      scrollVal.refresh()
      isPullUpLoad.value = false
    }
  })
  // 注销实例
  onUnmounted(() => {
    scroll.value.destroy()
  })

  return {
    scroll,
    rootRef,
    isPullUpLoad
  }
}