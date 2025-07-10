<template>
    <el-scrollbar class="chapter-card">
        <div class="word-card" :class="{ 'active': store.currentChapterWordIndex === word_index }"
            v-for="(item, word_index) in chapterWords" :key="item.id" @click="handleClick(word_index)"
            :id="`word-item-${word_index}`">
            <div class="word-card-item">
                <div class="word-card-item-title">
                    <div class="word-card-item-title-name">{{ item.name }}</div>
                    <div class="word-card-item-title-icon">
                        <el-icon >
                            <CircleCheckFilled v-if="isGrasp(item)" @click.stop="handleUnGrasp(item)" />
                            <CircleCheck v-else @click.stop="handleGrasp(item)" />
                        </el-icon>
                        <el-icon>
                            <StarFilled v-if="isCollect(item)" @click.stop="handleUnCollect(item)" />
                            <Star v-else @click.stop="handleCollect(item)" />
                        </el-icon>
                    </div>
                </div>
                <div class="word-card-item-content">
                    <div class="word-card-item-content-item" v-for="(transition, trans_index) in item.trans"
                        :key="trans_index">
                        {{ transition }}
                    </div>
                </div>
            </div>
        </div>
    </el-scrollbar>
</template>
<script setup>
import { useBaseStore } from '@/stores/base';
import { computed, watchEffect, onMounted } from 'vue';
import { CircleCheck, CircleCheckFilled, Star, StarFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const store = useBaseStore()

const chapterWords = computed(() => {
    return store.currentChapter
})


// 点击 激活单词
const handleClick = (word_index) => {
    store.changeWord(word_index)
}

// 是否掌握
const isGrasp = (item) => {
    return store.graspWords.find(v => v.name === item?.name)
}

// 是否收藏
const isCollect = (item) => {
    return store.collectWords.find(v => v.name === item?.name)
}

// 掌握单词
const handleGrasp = (item) => {
    ElMessage.success({ message: "掌握单词", duration: 1000 })
    store.addGraspWord(item)
}
//取消掌握单词
const handleUnGrasp = (item) => {
    ElMessage.success({ message: "取消掌握单词", duration: 1000 })
    store.deleteGraspWord(item)
}

// 收藏单词
const handleCollect = (item) => {
    ElMessage.success({ message: "收藏成功", duration: 1000 })
    store.addCollectWord(item)
}
//取消收藏单词
const handleUnCollect = (item) => {
    ElMessage.success({ message: "取消收藏单词", duration: 1000 })
    store.deleteCollectWord(item)
}

// 监听当前单词索引变化，自动滚动到对应位置
watchEffect(() => {
    const wordItem = document.getElementById(`word-item-${store.currentChapterWordIndex}`)
    if (wordItem) {
        wordItem.scrollIntoView({ block: store.activeCardPosition, behavior: 'smooth' })
    }
})


</script>
<style scoped lang="scss">
.chapter-card {}


.word-card {
    font-size: 12px;
    color: #666;
    // border: 1px solid #ccc;
    box-shadow: 0px 0px 6px 0px #c3c3c373;

    border-radius: 10px;
    padding: 10px;
    box-sizing: content-box;
    margin: 10px;

}

.active {
    .word-card-item-title-name {
        color: var(--el-color-primary);
    }
}




.word-card-item-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .word-card-item-title-name {
        font-size: 16px;
        font-weight: bold;

    }

    .word-card-item-title-icon {
        display: flex;
        align-items: center;
        gap: 10px;

        .el-icon {
            font-size: 14px;
            cursor: pointer;
            color: var(--el-color-primary);
        }
    }
}
</style>
