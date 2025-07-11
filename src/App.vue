<template>
    <router-view></router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import {useBaseStore} from "@/stores/base";
import { watch } from 'vue';
import { SAVE_DICT_KEY } from '@/utils/const.js';

import localforage from 'localforage';

const store = useBaseStore()

//初始化
async function init() {
  store.init().then(() => {

  })
}

//保存词典到本地
watch(store.$state, (n) => {
  localforage.setItem(SAVE_DICT_KEY.key, JSON.stringify({val: n, version: SAVE_DICT_KEY.version}))
})


onMounted(() => {
  init()

})

</script>
