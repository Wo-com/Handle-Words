<template>
    <el-popover :width="250" :popper-style="{ height: '240px', overflow: 'auto' }" content="Bottom Center prompts info"
        placement="bottom">
        <template #reference> <el-button> 设置</el-button></template>
        <div class="setting-content">
            <div class="setting-content-item">
                <el-text link>主题</el-text>
                <el-switch v-model="store.lightTheme" inline-prompt :active-value="true" :inactive-value="false"
                    :active-icon="Sunny" :inactive-icon="Moon" />
            </div>
            <div class="setting-content-item">
                <el-text link>发音</el-text>
                <el-switch v-model="store.wordSoundType" inline-prompt active-value="uk" inactive-value="us"
                    active-text="美" inactive-text="英" />
            </div>
            <div class="setting-content-item">
                <el-text link>是否显示单词卡</el-text>
                <el-switch v-model="store.showWordCard" inline-prompt :active-value="true" :inactive-value="false" />
            </div>
            <div class="setting-content-item">
                <el-text link>高亮单词位置</el-text>
                <el-radio-group size="small" v-model="store.activeCardPosition">
                    <el-radio-button value="start">上</el-radio-button>
                    <el-radio-button value="center">中</el-radio-button>
                    <el-radio-button value="end">下</el-radio-button>
                </el-radio-group>
            </div>
            <div class="setting-content-item">
                <el-text link>隐藏掌握的单词</el-text>
                <el-switch v-model="store.hideGraspWords" inline-prompt :active-value="true" :inactive-value="false" />
            </div>
            <div class="setting-content-item">
                <el-text link>隐藏收藏的单词</el-text>
                <el-switch v-model="store.hideCollectWords" inline-prompt :active-value="true"
                    :inactive-value="false" />
            </div>
            <div class="setting-content-item">
                <el-text link>学习数据</el-text>
                <div>
                    <el-button size="small" @click="exportData">导出</el-button>
                    <el-button size="small" @click="importData">导入</el-button>
                </div>
            </div>
        </div>
    </el-popover>
</template>

<script setup>
import { useBaseStore } from '@/stores/base';
import { Sunny, Moon } from '@element-plus/icons-vue';
import { watch } from 'vue';
const store = useBaseStore()

watch(() => store.lightTheme, (newVal) => {
    const html = document.documentElement;
    if (newVal) {
        html.setAttribute("class", "");
    } else {
        html.setAttribute("class", "dark");
    }
})

//导出数据
const exportData = () => {
    store.exportData()
}

//导入数据
const importData = () => {
    store.importData()
}

</script>

<style scoped>
.setting-content-item {
    display: flex;
    justify-content: space-between;
}
</style>