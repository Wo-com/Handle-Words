// stores/counter.js
import { defineStore } from "pinia";
import { chunk, cloneDeep, merge } from "lodash-es";
import { nanoid } from "nanoid";
import { saveAs } from "file-saver";
import { APP_NAME, SAVE_DICT_KEY } from "@/utils/const.js";
import { dictionaryResources } from "@/assets/dictionary.js";
import { checkAndUpgradeSaveDict } from "@/utils/index.js";
import * as localforage from "localforage";
import { DefaultDict } from "@/utils/const.js";
import { useRuntimeStore } from "./runtime";
import { ElMessage } from "element-plus";
import { PronunciationApi } from "@/utils/const.js";

export const DefaultBaseState = () => ({
  myDictList: [
    {
      ...cloneDeep(DefaultDict),
      id: "grasp",
      name: "已掌握",
      type: "grasp",
      category: "自带字典",
      tags: ["自带"],
      isCustom: true,
    },
    {
      ...cloneDeep(DefaultDict),
      id: "collect",
      name: "收藏",
      type: "collect",
      category: "自带字典",
      tags: ["自带"],
      isCustom: true,
    },
  ],
  currentDictIndex: 0, //默认选择词典
  currentChapterIndex: 0, //默认选择章节
  currentChapterWordIndex: 0, //默认选择章节单词
  graspWords: [], //已掌握的词汇
  collectWords: [], //收藏的词汇

  lightTheme: true, //主题 默认白色
  activeCardPosition: "start", //激活卡片位置  start:上 , center:中 , end:下
  showWordCard: true, //是否显示单词卡
  wordSoundType: "us", //发音  us:美音 , uk:英音
  hideGraspWords: false, //是否隐藏掌握的单词
  hideCollectWords: false, //是否隐藏收藏的单词
});

export const useBaseStore = defineStore("base", {
  state: () => {
    return DefaultBaseState();
  },

  getters: {
    currentDict() {
      return this.myDictList[this.currentDictIndex];
    },
    currentChapter(state) {
      return this.currentDict.chapterWords[this.currentChapterIndex] ?? [];
    },
    currentChapterName(state) {
      return `第${this.currentChapterIndex + 1}章`;
    },
    currentWord(state) {
      return this.currentChapter[this.currentChapterWordIndex] ?? {};
    },
  },
  actions: {
    setState(obj) {
      //这样不会丢失watch的值的引用
      merge(this, obj);
    },

    async init(outData) {
      return new Promise(async (resolve) => {
        //初始化翻译词库
        const runtimeStore = useRuntimeStore();
        if (!runtimeStore.translateWordList.length) {
          setTimeout(async () => {
            let r2 = await fetch("./translate/en2zh_CN-min.json");
            let list = await r2.json();
            if (list && list.length) {
              runtimeStore.translateWordList = list;
            }
          });
        }
        //初始化已掌握的词汇
        if (!this.graspWords.length) {
          const graspChapterWords = this.myDictList.find(
            (v) => v.id === "grasp"
          ).chapterWords;
          this.graspWords = graspChapterWords.flat();
        }
        //初始化收藏的词汇
        if (!this.collectWords.length) {
          const collectWords = this.myDictList.find(
            (v) => v.id === "collect"
          ).chapterWords;
          this.collectWords = collectWords.flat();
        }

        //初始化字典
        try {
          if (outData) {
            this.setState(outData);
          } else {
            let configStr = await localforage.getItem(SAVE_DICT_KEY.key);
            let data = checkAndUpgradeSaveDict(configStr);
            this.setState(data);

            // 第一次初始化如果本地没有读取到数据 读取加载dictionaryResources第一个 词典
            if (Object.keys(data).length === 0) {
              const defaultDict = await this.loadDict(dictionaryResources[0]);
              this.addDict(defaultDict);
              this.changeDict(defaultDict);
            }
          }
          localforage.setItem(
            SAVE_DICT_KEY.key,
            JSON.stringify({ val: this.$state, version: SAVE_DICT_KEY.version })
          );
        } catch (e) {
          console.error("读取本地dict数据失败", e);
        }
        resolve(true);
      });
    },

    // 添加字典
    addDict(dict) {
      try {
        this.myDictList.push(dict);
      } catch (e) {
        console.error("添加字典失败", e);
      }
    },
    // 删除字典
    deleteMyDict(dict) {
      this.myDictList = this.myDictList.filter((v) => v.id !== dict.id);
    },
    // 添加已掌握的词汇
    addGraspWord(word) {
      // 判断是否已存在
      if (!this.graspWords.find((v) => v.id === word.id)) {
        this.graspWords.push(word);
        this.setGraspWords();
      }
    },
    // 删除已掌握的词汇
    deleteGraspWord(word) {
      this.graspWords = this.graspWords.filter((v) => v.id !== word.id);
      this.setGraspWords();
    },
    // 添加收藏的词汇
    addCollectWord(word) {
      // 判断是否已存在
      if (!this.collectWords.find((v) => v.id === word.id)) {
        this.collectWords.push(word);
        this.setCollectWords();
      }
    },
    // 删除收藏的词汇
    deleteCollectWord(word) {
      this.collectWords = this.collectWords.filter((v) => v.id !== word.id);
      this.setCollectWords();
    },
    // 是否掌握
    isGrasp(item) {
      return this.graspWords.find((v) => v.name === item?.name);
    },
    // 是否收藏
    isCollect(item) {
      return this.collectWords.find((v) => v.name === item?.name);
    },
    // 设置已掌握的词汇
    setGraspWords() {
      const dict = this.myDictList.find((v) => v.id === "grasp");
      dict.length = this.graspWords.length;
      //词汇划分章节
      dict.chapterWords = chunk(
        this.graspWords,
        dict.chapterWordNum //词汇自带的每章节单词数
      );
    },
    // 设置收藏的词汇
    setCollectWords() {
      const dict = this.myDictList.find((v) => v.id === "collect");
      dict.length = this.collectWords.length;
      //词汇划分章节
      dict.chapterWords = chunk(
        this.collectWords,
        dict.chapterWordNum //词汇自带的每章节单词数
      );
    },

    // 切换字典
    changeDict(dict) {
      let rIndex = this.myDictList.findIndex((v) => v.id === dict.id);
      this.currentDictIndex = rIndex;
      this.currentChapterIndex = dict.historyChapterIndex ?? 0; //读取历史章节下标
      this.currentChapterWordIndex = dict.historyWordIndex ?? 0; //读取历史单词下标
    },

    // 切换章节
    changeChapter() {
      this.currentChapterWordIndex = 0;
      this.currentDict.historyChapterIndex = this.currentChapterIndex; //记录章节下标 历史
    },

    // 切换单词
    changeWord(index) {
      this.currentChapterWordIndex = index;
      this.currentDict.historyWordIndex = index; //记录单词下标 历史
    },

    // 下一个单词
    nextWord() {
      let nextIndex = this.currentChapterWordIndex + 1;
      let length = this.currentChapter.length;
      if (this.hideGraspWords || this.hideCollectWords) {
          for (let i = nextIndex; i < length; i++) {
              if (this.hideGraspWords && this.isGrasp(this.currentChapter[i])) {
                  //跳过已掌握的单词
                  nextIndex++;
              } else if (this.hideCollectWords && this.isCollect(this.currentChapter[i])) {
                  //跳过已收藏的单词
                  nextIndex++;
              } else {
                  break;
              }
          }
      }
      if (nextIndex === length) {
          ElMessage.success("恭喜你，本章已学完")
          return;
      }
      this.changeWord(nextIndex)
      this.playSound(this.currentWord.name)
    },

    // 播放单词发音
    playSound(word) {
      const audio = new Audio();
      if (this.wordSoundType === "uk") {
        audio.src = `${PronunciationApi}${word}&type=1`;
      } else if (this.wordSoundType === "us") {
        audio.src = `${PronunciationApi}${word}&type=2`;
      }
      audio.play().then((r) => void 0);
    },

    // 编辑字典
    updateDict(newDict) {
      const oldDict = this.myDictList.find((item) => item.id === newDict.id);
      oldDict.chapterWords = newDict.chapterWords;
      oldDict.name = newDict.name;
      oldDict.description = newDict.description;
      oldDict.chapterWordNum = newDict.chapterWordNum;
      oldDict.wordOrder = newDict.wordOrder;
    },

    async loadDict(val) {
      const runtimeStore = useRuntimeStore();
      let item = val;
      let find = this.myDictList.find((v) => v.id === item.id);
      if (find) {
        runtimeStore.editDict = cloneDeep(find);
      } else {
        runtimeStore.editDict = cloneDeep({
          ...cloneDeep(DefaultDict),
          ...item,
        });
        runtimeStore.editDict.id = nanoid(6);
      }

      //如果不是自定义词典，并且有url地址才去下载
      if (!runtimeStore.editDict.isCustom && runtimeStore.editDict.url) {
        let url = `./dicts/${runtimeStore.editDict.language}/${runtimeStore.editDict.type}/${runtimeStore.editDict.translateLanguage}/${runtimeStore.editDict.url}`;
        if (runtimeStore.editDict.type === "word") {
          let r = await fetch(url);
          let v = await r.json();

          // 给每个单词添加id
          v.map((s) => {
            s.id = nanoid(6);
          });
          //翻译单词
          if (runtimeStore.editDict.translateLanguage === "common") {
            v.map((s) => {
              let res = runtimeStore.translateWordList.find(
                (a) => a.name === s.name
              );
              if (res) s = Object.assign(s, res);
            });
          }

          runtimeStore.editDictOriginWords = cloneDeep(v);
          runtimeStore.editDict.chapterWords = chunk(
            runtimeStore.editDictOriginWords,
            runtimeStore.editDict.chapterWordNum //词汇自带的每章节单词数
          );
        }
      }
      return runtimeStore.editDict;
    },

    // 导出数据
    exportData() {
      let data = {
        version: "1.0.1",
        val: this.$state,
      };
      let blob = new Blob([JSON.stringify(data)], {
        type: "text/plain;charset=utf-8",
      });
      let date = new Date();
      let dateStr = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
      saveAs(blob, `${APP_NAME}-User-Data-${dateStr}.json`);
    },

    // 导入数据
    importData() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = JSON.parse(e.target.result);
          this.setState(data.val);
        };
        reader.readAsText(file);
      };
      input.click();
    },
  },
});
