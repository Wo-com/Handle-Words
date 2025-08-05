<template>
    <div class="container">

        <div class="header">
            <DictName />
            <ChapterName />
            <Setting />
        </div>

        <div v-show="store.showWordCard" class="chapter-word-card">
            <ChapterWordCard />
        </div>

        <div class="word-spelling">
            <WordSpelling></WordSpelling>
        </div>

    </div>

    <el-dialog v-model="store.showMyDict" :width="1000" title="">
        <div class="my-dict">
            <MyDict  @editDict="handleEditDict" />
        </div>
    </el-dialog>

    <el-dialog v-model="store.showSelectDict" :width="1000" title="">
        <div class="select-dict">
            <Dicts/>
        </div>
    </el-dialog>

    <el-dialog v-model="store.showEditDict" :close-on-click-modal="false" :close-on-press-escape="false" :width="1000"
        title="">
        <div class="edit-dict">
            <EditDict :editDict="editDict" />
        </div>
    </el-dialog>


</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import WordSpelling from '@/views/spelling/wordspelling.vue';
import DictName from '@/views/topTool/dictName.vue';
import ChapterName from '@/views/topTool/chapterName.vue';
import Setting from '@/views/topTool/Setting.vue';
import ChapterWordCard from '@/views/rightCard/ChapterWordCard.vue';
import Dicts from '@/views/vocabulary/AllDicts.vue';
import MyDict from '@/views/vocabulary/MyDict.vue';
import EditDict from '@/views/vocabulary/EditDict.vue';
import { useBaseStore } from '@/stores/base';

const store = useBaseStore()
const editDict = ref({})

const handleEditDict = (dict) => {
    editDict.value = dict
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
    overflow: auto;
    border-radius: 10px;
}

.my-dict {
    width: 100%;
    max-height: 500px;
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