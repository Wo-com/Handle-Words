<template>
    <div class="edit-container">
        <div class="edit-container-top">
            <div class="dict-edit">
                <el-form :model="tempDict" label-width="100px">
                    <el-form-item label="词典名称">
                        <el-input style="width: 200px;" v-model="tempDict.name" />
                    </el-form-item>

                    <el-form-item label="词典描述">
                        <el-input type="textarea" :rows="2" maxlength="20" show-word-limit style="width: 200px;"
                            v-model="tempDict.description" />
                    </el-form-item>

                    <el-form-item label="单词顺序">
                        <el-radio-group size="small" v-model="tempDict.wordOrder">
                            <el-radio value="default">默认</el-radio>
                            <el-radio value="order">顺序</el-radio>
                            <el-radio value="random">随机</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="章节单词数">
                        <div style="display: flex;justify-content: space-between;">
                            <el-slider @change="handleChapterWordNumChange" style="width: 120px; " :min="1"
                                :max="props.editDict.length" v-model="tempDict.chapterWordNum" />
                            <el-input-number @change="handleChapterWordNumChange" :controls="false" style="width: 60px;"
                                :min="1" :max="props.editDict.length" v-model="tempDict.chapterWordNum" />
                        </div>
                    </el-form-item>

                </el-form>
            </div>
            <div class="dict-book">
                <el-scrollbar class="dict-chapter">
                    <div class="edit-chapter-item" v-for="(item, index) in tempDict.chapterWords" :key="index"
                        @click="handleChapterClick(index)">
                        <div class="edit-chapter-item-title">第{{ index + 1 }}章 共{{ item.length }}个单词</div>
                    </div>
                </el-scrollbar>
                <el-scrollbar class="dict-chapter-word">
                    <div class="edit-chapter-word-item" v-for="item in currentChapterWords" :key="item.id">
                        <div class="word-detail">
                            <div class="word-name">{{ item.name }}</div>
                            <div class="word-phone">
                                <div>{{ item.ukphone }}</div>
                                <div>{{ item.usphone }}</div>
                            </div>
                            <div class="word-translation">
                                <div v-for="translation in item.trans" :key="translation">{{ translation }}</div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>


        </div>
        <div class="edit-container-bottom">
            <div class="dict-chapter-word-add">
                <el-button type="primary" @click="handleChapterWordAdd">确定</el-button>
            </div>
        </div>

    </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { chunk, cloneDeep } from 'lodash-es'
import { useBaseStore } from '@/stores/base'
import { ElMessage } from 'element-plus'
const store = useBaseStore()

const emit = defineEmits(['editDictFinish'])

const props = defineProps({
    editDict: {
        type: Object,
        default: () => ({})
    }
})

//所有单词
let dictWords = []
//编辑词典
const tempDict = ref({
    name: '',//词典名称
    description: '',//词典描述
    chapterWordNum: 0,//章节单词数
    chapterWords: [],//章节单词
    wordOrder: 'default'//单词顺序
})
watch(() => props.editDict, (newVal) => {
    tempDict.value.name = newVal.name
    tempDict.value.description = newVal.description
    tempDict.value.chapterWordNum = newVal.chapterWordNum
    tempDict.value.chapterWords = newVal.chapterWords
    //二维数组转一维数组
    dictWords = cloneDeep(newVal.chapterWords.flat())
})
onMounted(() => {
    tempDict.value.name = props.editDict.name
    tempDict.value.description = props.editDict.description
    tempDict.value.chapterWordNum = props.editDict.chapterWordNum
    tempDict.value.chapterWords = props.editDict.chapterWords

    dictWords = cloneDeep(props.editDict.chapterWords.flat())
})


//当前章节单词
const currentChapterWords = ref([])
//处理章节点击
const handleChapterClick = (index) => {
    currentChapterWords.value = tempDict.value.chapterWords[index]
}

//重新分配单词
const handleChapterWordNumChange = (value) => {
    tempDict.value.chapterWordNum = value
    //计算章节单词
    tempDict.value.chapterWords = chunk(dictWords, value)
}

const handleChapterWordAdd = () => {
    const oldDict = store.myDictList.find(item => item.id === props.editDict.id)
    oldDict.chapterWords = tempDict.value.chapterWords
    oldDict.name = tempDict.value.name
    oldDict.description = tempDict.value.description
    oldDict.chapterWordNum = tempDict.value.chapterWordNum
    oldDict.wordOrder = tempDict.value.wordOrder

    emit('editDictFinish', oldDict)
    ElMessage.success('编辑词典完成')
}



</script>

<style scoped lang="scss">
.edit-container {}

.edit-container-top {
    width: 100%;
    height: 400px;
    display: flex;

    // border: 1px solid #ccc;
}

.dict-book {
    display: flex;
    // padding: 10px;
    box-shadow: 0px 0px 6px 0px #c3c3c373;
}

.edit-container-bottom {
    width: 100%;
    height: 2opx;
    //右侧
    display: flex;
    justify-content: flex-end;

    // border: 1px solid #ccc;
}

.edit-chapter-item-title {
    // border: 1px solid #ddd;
    box-shadow: 0px 0px 6px 0px #c3c3c373;
    border-radius: 4px;
    padding: 4px;
    margin: 4px;
    cursor: pointer;

    &:hover {
        color:var(--el-color-primary);
    }
}

.dict-edit {
    width: 400px;
    height: 100%;
    // border: 1px solid #ccc;
}

.dict-chapter {
    width: 200px;
    height: 100%;
    // border: 1px solid #ccc;
    overflow-y: auto;
}

.dict-chapter-word {
    width: 300px;
    height: 100%;
    // border: 1px solid #ccc;
    overflow-y: auto;
}

.edit-chapter-word-item {
    // border: 1px solid #ddd;
    box-shadow: 0px 0px 6px 0px #c3c3c373;
    border-radius: 4px;
    padding: 4px;
    margin: 4px;
    cursor: pointer;

    &:hover {
        color:var(--el-color-primary);
    }
}


.word-detail {
    .word-name {
        font-size: 16px;
        font-weight: bold;
        
    }

    .word-phone {
        display: flex;
    }
}
</style>