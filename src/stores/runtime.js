import {defineStore} from "pinia"
import {DefaultDict} from "@/utils/const.js";


export const useRuntimeStore = defineStore('runtime', {
  state: () => {
    return {
      translateWordList: [],//翻译词库
      editDict: {...DefaultDict},//当前编辑的词库      
      editDictOriginWords: [],//当前编辑的词库原始单词列表
    }
  },
})