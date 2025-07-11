import { ElLoading } from "element-plus"

/* 全局请求 loading */
let loadingInstance

/**
 * @description 开启 Loading
 * */
export const startLoading = (text = "Loading") => {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: text,
    background: "rgba(0, 0, 0, 0.7)"
  })
}

/**
 * @description 结束 Loading
 * */
export const endLoading = () => {
  loadingInstance.close()
}

/**
 * @description 显示全屏加载
 * */
let needLoadingRequestCount = 0
export const showFullScreenLoading = () => {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

/**
 * @description 隐藏全屏加载
 * */
export const tryHideFullScreenLoading = () => {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}
