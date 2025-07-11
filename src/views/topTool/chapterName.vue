<template>
     <el-popover :popper-style="{ height: '200px', overflow: 'auto' }" content="Bottom Center prompts info"
        placement="bottom">
        <template #reference> <el-button> {{ store.currentChapterName }}</el-button></template>
        <el-radio-group style="width: 100px;" v-model="store.currentChapterIndex" @change="clickChapter">
            <el-radio v-for="(item, index) in store.currentDict.chapterWords" :value="index">第{{ index + 1
                }}章&nbsp;&nbsp;&nbsp;{{ item.length }}词</el-radio>
        </el-radio-group>
    </el-popover>
</template>

<script setup>
import { useBaseStore } from '@/stores/base';
const store = useBaseStore()

//选择章节
const clickChapter = (chapterIndex) => {
    store.changeChapter()
}
</script>