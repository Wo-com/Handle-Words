<template>
  <div>
    <el-tabs v-model="activeBigTypeTab" @tab-click="handleBigTypeChange">
      <el-tab-pane v-for="(bigType, bigIndex) in groupDict" :key="bigIndex" :label="bigType.name" :name="bigType.name">
        <div>
          <el-tabs v-model="activeMediumTypeTab">
            <el-tab-pane v-for="(mediumType, mediumIndex) in bigType.array" :key="mediumIndex" :label="mediumType.name"
              :name="mediumType.name">
              <div class="dict-list">
                <div v-for="(dict, dictIndex) in mediumType.array" :key="dictIndex">
                  <div class="dict-item anim" @click="handleClickDict(dict)">
                    <template v-if="dict.id">
                      <div class="dict-top-name">{{ dict.name }}</div>
                      <div class="dict-description">{{ dict.description }}</div>
                      <div class="dict-length">{{ dict?.length }} 词</div>
                    </template>
                  </div>
                </div>
              </div>

            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>


<script setup>
// 标签切换状态管理
import { ref, computed, reactive, watchEffect } from 'vue';
import { groupBy } from "lodash-es";
import { dictionaryResources } from "@/assets/dictionary";
import { useBaseStore } from '@/stores/base'
import { ElLoading } from 'element-plus'
import { startLoading, endLoading } from '@/utils/loding'

const emit = defineEmits(['selectDict', 'selectDictToMyDict'])
const store = useBaseStore()

const activeBigTypeTab = ref('')
const activeMediumTypeTab = ref('')


// 按标签分组
const groupedByTags = (data) => {
  return data.reduce((acc, item) => {
    item.tags.forEach(tag => {
      const groupIndex = acc.findIndex(g => g.name === tag);
      if (groupIndex === -1) {
        acc.push({  name: tag,  array: [item]  });
      } else {
        acc[groupIndex].array.push(item);
      }
    });
    return acc;
  }, []);
}


const groupDict = computed(() => {
  // 按分类分组
  const groupByCategory = groupBy(dictionaryResources, 'category')
  let data = []
  for (const [key, value] of Object.entries(groupByCategory)) {
    const obj = { "name": key, "array": groupedByTags(value) }
    data.push(obj)
  }
  return data
})


watchEffect(() => {
  activeBigTypeTab.value = groupDict.value[0].name
  activeMediumTypeTab.value = groupDict.value[0].array[0].name
});

const handleBigTypeChange = (tab) => {
  activeMediumTypeTab.value = groupDict.value[tab.index].array[0].name
}



// 添加学习
const handleClickDict = async (dict) => {
  emit('selectDictToMyDict', dict)
  startLoading("正在加载...")
  const editDict = await store.loadDict(dict)
  store.addDict(editDict)
  endLoading()
  console.log("添加学习完成", editDict)
}


</script>



<style scoped lang="scss">


.dict-list {
  display: flex;
  flex-wrap: wrap;
  // gap: 15px;
}

.dict-item {
  cursor: pointer;
  width: 128px;
  height: 180px;
  border-radius: 10px;
  margin: 15px;
  padding: 15px;
  box-shadow: 0px 0px 6px 0px #c3c3c373;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .dict-top-name {
    font-size: 14px;
    font-weight: bold;
    cursor: grab;
  }

  .dict-description {
    font-size: 12px;
    color: #666;
  }

  .dict-length {
    font-size: 12px;
    color: #666;
  }


}
</style>