import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18;
  const scrollRef = ref(null)

  const shortcutList = computed(() => {
    return props.data.map(group => group.title);
  })

  const touch = {}

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index, 10);
    touch.y1 = e.touches[0].pageY;
    touch.anchorIndex = anchorIndex;
    
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    //  | 0 相当于 Math.floor
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0;
    const anchorIndex = touch.anchorIndex + delta;

    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    if(Number.isNaN(index)) return
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}