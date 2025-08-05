<template>
    <div class="dict-box" ref="el">
        <div class="dict-item" v-for="dict in store.myDictList" :key="dict.id" @click="handleClickMyDict(dict)">
            
            <div class="dict-top-name">{{ dict.name }}</div>
            <div class="dict-center">
                <div class="dict-description">{{ dict.description }}</div>
            </div>

            <div class="count-dict">
                <div  class="dict-length">总计{{ dict.length }} 词</div>
                <div v-if="dict.type === 'word'" class="dict-length">掌握{{ getGraspNum(dict) }} 词</div>
            </div>

        
            <div class="dict-bottom">
                <div  class="dict-tool">
                    <el-icon  @click.stop="handleClickEdit(dict)">
                        <Edit />
                    </el-icon>
                    <el-icon  v-if="dict.type === 'word'" @click.stop="handleClickDelete(dict)">
                        <Delete />
                    </el-icon>
                </div>
            </div>
        </div>
        <div class="dict-item" @click="addDict">
            <div class="dict-add">
                <el-icon>
                    <Plus />
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBaseStore } from '@/stores/base'
import { ref, onMounted, computed } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue';
import { cloneDeep } from 'lodash-es'
import { useDraggable } from 'vue-draggable-plus'
const el = ref()

const store = useBaseStore()
const emit = defineEmits(['editDict'])


// 点击我的词典 切换当前词典
const handleClickMyDict = async (dict) => {
    store.isShowMyDict(false)
    store.changeDict(dict)
}

// 编辑词典
const handleClickEdit = (dict) => {
    store.isShowEditDict(true)
    emit('editDict', cloneDeep(dict))
}

// 删除词典
const handleClickDelete = (dict) => {
    store.deleteMyDict(dict)
    const lastDict = store.myDictList[store.myDictList.length - 1]
    store.changeDict(lastDict)
}

// 获取已掌握词数
const getGraspNum = (dict) => {
    return dict.chapterWords.reduce((acc, curr) => {
        return acc + curr.filter(item => store.isGrasp(item)).length
    }, 0)
}

// 拖拽
useDraggable(el, store.myDictList, {
    animation: 400,//拖拽动画时间
    handle: '.dict-top-name'//拖拽绑定的元素
})


onMounted(() => {

})

</script>

<style scoped>
.dict-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}

.dict-list {
    display: flex;
    justify-content: space-between;
}

.dict-item {
    cursor: pointer;
    width: 128px;
    height: 180px;
    border-radius: 10px;
    margin: 15px;
    padding: 15px;
    box-sizing: border-box;
    box-shadow: 0px 0px 6px 0px #c3c3c373;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.dict-add {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dict-top-name{
    font-size: 16px;
    font-weight: bold;
    cursor: grab;
}

.dict-center{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.dict-description{
    font-size: 12px;
    color: #666;
}

.count-dict{
    height: 30px;
}

.dict-length{
    font-size: 12px;
    color: #666;
}

.dict-bottom{
    height: 18px;
    display: flex;
    justify-content: flex-end
}

.dict-tool {
    width: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>