<template>
    <el-button @click="clickCurrentDictName"> {{ store.currentDict.name }}</el-button>
</template>

<script setup>
import { useBaseStore } from '@/stores/base';
const store = useBaseStore()

const clickCurrentDictName = () => {
    store.isShowMyDict(true)
}
</script>