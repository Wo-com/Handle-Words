<template>
    <el-button @click="emit('clickCurrentDictName')"> {{ store.currentDict.name }}</el-button>
</template>

<script setup>
import { useBaseStore } from '@/stores/base';
const store = useBaseStore()
const emit = defineEmits(['clickCurrentDictName'])
</script>