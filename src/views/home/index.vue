<template>
    <div class="container">

        <div class="header">
            <DictName @clickCurrentDictName="clickCurrentDictName" />
            <ChapterName />
            <Setting />
        </div>

        <div v-show="store.showWordCard" class="chapter-word-card">
            <ChapterWordCard />
        </div>

        <div class="word-spelling">
            <WordSpelling :enwords="enSpellingWord" :cnwords="cnSpellingWord" @success="spelled"></WordSpelling>
        </div>

    </div>

    <el-dialog v-model="showMyDict" :width="1000" title="">
        <div class="my-dict">
            <MyDict @addDict="showSelectDict = true" @editDict="handleEditDict" @practiceDict="practiceDict" />
        </div>
    </el-dialog>


    <el-dialog v-model="showSelectDict" :width="1000" title="">
        <div class="select-dict">
            <Dicts @selectDictToMyDict="selectDictToMyDict" />
        </div>
    </el-dialog>

    <el-dialog v-model="showEditDict" :close-on-click-modal="false" :close-on-press-escape="false" :width="1000"
        title="">
        <div class="edit-dict">
            <EditDict :editDict="editDict" @editDictFinish="editDictFinish" />
        </div>
    </el-dialog>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

import DictName from '@/views/dict/topTool/dictName.vue';
import ChapterName from '@/views/dict/topTool/chapterName.vue';
import Setting from '@/views/dict/topTool/Setting.vue';

import Dicts from '@/views/dict/Dicts.vue';
import MyDict from '@/views/dict/MyDict.vue';
import EditDict from '@/views/dict/EditDict.vue';
import { useBaseStore } from '@/stores/base';
import WordSpelling from '@/components/wordspelling.vue';

import ChapterWordCard from '@/views/dict/rightCard/ChapterWordCard.vue';
import { ElMessage } from 'element-plus'

const store = useBaseStore()
const showSelectDict = ref(false)
const showMyDict = ref(false)
const showEditDict = ref(false)


const practiceDict = (dict) => {
    showMyDict.value = false
}

const editDict = ref({})
const handleEditDict = (dict) => {
    editDict.value = dict
    showEditDict.value = true
}
const editDictFinish = (dict) => {
    showEditDict.value = false
}


const clickCurrentDictName = () => {
    showMyDict.value = true
}


// 选择字典 新增学习的词典
const selectDictToMyDict = () => {
    showSelectDict.value = false
}




const enSpellingWord = computed(() => {
    return store.currentChapter[store.currentChapterWordIndex]?.name
})
const cnSpellingWord = computed(() => {
    return store.currentChapter[store.currentChapterWordIndex]?.trans
})
const spelled = () => {
    if (store.currentChapterWordIndex < store.currentChapter.length - 1) {
        store.changeWord(store.currentChapterWordIndex + 1)
    } else {
        ElMessage.success("恭喜你，本章已学完")
    }
}







onMounted(() => {

})


</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
}

.header {
    padding-top: 50px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 10px;
}

.word-spelling {
    padding-top: 100px;
}

.select-dict {
    width: 100%;
    max-height: 550px;
    // border: 1px solid #ccc;
    overflow: auto;
    border-radius: 10px;
}

.my-dict {
    width: 100%;
    max-height: 500px;
    // border: 1px solid #ccc;
    overflow: auto;
    border-radius: 10px;
}

.chapter-word-card {
    width: 200px;
    height: 80%;
    position: absolute;
    top: 10%;
    right: 20px;
}
</style>