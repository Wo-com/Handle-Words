<template>
    <el-popover :width="250" :popper-style="{ height: '200px', overflow: 'auto' }" content="Bottom Center prompts info"
        placement="bottom">
        <template #reference> <el-button> 设置</el-button></template>
        <div class="setting-content">
            <div class="setting-content-item">
                <el-button link>主题</el-button>
                <el-switch  v-model="store.lightTheme" inline-prompt :active-value="true"
                    :inactive-value="false"   :active-icon="Sunny" :inactive-icon="Moon"/>
            </div>
            <div class="setting-content-item">
                <el-button link>发音</el-button>
                <el-switch  v-model="store.wordSoundType" inline-prompt active-value="uk"
                    inactive-value="us"    active-text="美音"
                    inactive-text="英音"/>
            </div>
            <div class="setting-content-item">
                <el-button link>是否显示单词卡</el-button>
                <el-switch v-model="store.showWordCard" inline-prompt :active-value="true"
                    :inactive-value="false" />
            </div>
            <div class="setting-content-item">
                <el-button link>单词卡高亮单词位置</el-button>
                <el-radio-group size="small" v-model="store.activeCardPosition">
                    <el-radio value="start">上</el-radio>
                    <el-radio value="center">中</el-radio>
                    <el-radio value="end">下</el-radio>
                </el-radio-group>
            </div>
        </div>

    </el-popover>
</template>

<script setup>
import { useBaseStore } from '@/stores/base';
import { Sunny, Moon } from '@element-plus/icons-vue';
import {  watch } from 'vue';
const store = useBaseStore()


watch(() => store.lightTheme, (newVal) => {
    const html = document.documentElement;
    if (newVal) {
        html.setAttribute("class", "");
    } else {
        html.setAttribute("class", "dark");
    }
})



</script>

<style scoped>
.setting-content-item {
    display: flex;
}
</style>