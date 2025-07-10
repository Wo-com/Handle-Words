//有道发音api
export const PronunciationApi = 'https://dict.youdao.com/dictvoice?audio='

export const SAVE_DICT_KEY = {
    key: 'typing-word-dict',
    version: 3
}
export const SAVE_SETTING_KEY = {
    key: 'typing-word-setting',
    oldKey: 'typing-word-config',
    version: 8
}
export const EXPORT_DATA_KEY = {
    key: 'typing-word-export',
    version: 1
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

