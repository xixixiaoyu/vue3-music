import { PLAY_MODE, SEARCH_KEY, FAVORITE_KEY } from '../assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 顺序播放列表
  sequenceList: [],
  // 实际播放列表
  playlist: [],
  // 是否播放中
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 当前播放索引
  currentIndex: 0,
  // 播放器是否全屏
  fullScreen: false,
  // 收藏列表
  favoriteList: load(FAVORITE_KEY),
  // 搜索历史
  searchHistory: load(SEARCH_KEY),
  // 播放历史
  playHistory: []
}

export default state
