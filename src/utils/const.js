//有道发音api
export const PronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

export const APP_NAME = 'Handle-Word'

export const SAVE_DICT_KEY = {
    key: 'handle-word-dict',
    version: 3
}


export const DefaultDict = {
    id: '',
    name: '',
    description: '',
    isCustom: false,
    length: 0,
    url: '',
    category: '',
    tags: [],
    translateLanguage: 'common',
    type: 'word',
    language: 'en',

    chapterWordNum: 30,//每章节单词数
    chapterWords: [],//每个章节单词
    historyChapterIndex: 0,//章节下标
    historyWordIndex: 0,//单词下标
  }

