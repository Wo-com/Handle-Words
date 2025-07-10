<template>
    <div class="word-container">
        <div class="word-prompt">
            <div v-show="errorCount > 0">{{ props.enwords }}</div>
        </div>
        <div class="word-translation">
            <div v-for="(word, index) in props.cnwords" :key="index">{{ word }}</div>
        </div>
        <div class="word-label">
            <div class="word-display" @click="clichLabel(index)" :style="{ minWidth: `${getWordChWidth(index)}em` }"
                v-for="(word, index) in inputeCharacters" :key="index" :class="getWordClasses(index)">
                {{ word }}
            </div>
            <input type="text" lang="en" class="hidden-input" v-model="currentCharacter" @keyup.space.stop="handleSpace"
                @keydown.backspace.stop="handleBackspace">
                
            <div class="word-sound" @click="playSound(props.enwords)"><el-icon size="20"><VideoPlay /></el-icon></div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, computed, watch } from 'vue'
import { VideoPlay } from '@element-plus/icons-vue'
import { PronunciationApi } from '@/utils/const'
import { useBaseStore } from '@/stores/base'

const store = useBaseStore()

const emit = defineEmits(['success','reset'])
const props = defineProps({
    enwords: { type: String, default: '' },
    cnwords: { type: Array, default: '' },
})


// 将句子拆分为单词数组
const characters = computed(() => props.enwords.split(' '))

// 存储用户输入的单词
const inputeCharacters = ref(characters.value.map(() => ''))

// 当前输入的单词索引
const currentIndex = ref(0)
const errorCount=ref(0)
// 当前输入框的值
const currentCharacter = ref('')




// 监听当前输入，更新到inputeWords
watch(currentCharacter, (newVal) => {
    inputeCharacters.value[currentIndex.value] = newVal.replace(/\s+/g, '');
})



// 计算单词ch单位宽度 (增加一些额外空间)
const getWordChWidth = (index) => {
    // 创建Canvas测量（与方案一相同）
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const style = getComputedStyle(canvas);
    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    return ctx.measureText(characters.value[index]).width / 10;
}

// 获取单词的类名
// 获取单词的类名 - 按照优先级返回单一类名
const getWordClasses = (index) => {
    if (isValidWord(index)) {
        return 'valid' //正确输入
    } else if (currentIndex.value === index) {
        return 'focused'       //焦点
    } else {
        return 'invalid' //错误输入
    }
}




// 处理删除按键事件
const handleBackspace = (e) => {
    // 如果按下退格键且当前输入为空，移动到上一个单词
    if (currentCharacter.value === '' && currentIndex.value > 0) {
        currentIndex.value--
        currentCharacter.value = inputeCharacters.value[currentIndex.value]
    }

}

// 处理空格键事件
const handleSpace = () => {
    //去除空格
    currentCharacter.value = currentCharacter.value.replace(/\s+/g, '');
    if (currentIndex.value < characters.value.length - 1) {
        //切换下一个
        currentIndex.value++
        currentCharacter.value = inputeCharacters.value[currentIndex.value] || ''
    } else {
        // 已经是最后一个单词，可选择重置或其他操作
        if (checkAll()) {
            emit('success')
        }
    }
}



// 判断单词是否有效
const isValidWord = (index) => {
    return inputeCharacters.value[index] == characters.value[index]
}

// 检查所有单词是否输入正确
const checkAll = () => {

    // 如果单词数量不匹配，直接返回false
    if (inputeCharacters.value.length !== characters.value.length) {
        return false;
    }

    // 逐个比较每个单词
    for (let i = 0; i < characters.value.length; i++) {
        if (inputeCharacters.value[i] !== characters.value[i]) {
            // 记录错误次数
            errorCount.value++;
            return false;
        }
    }
    // 所有单词都正确
    return true;
}

// 播放单词发音
const playSound = (word) => {
    const audio = new Audio()
    if (store.wordSoundType === 'uk') {
      audio.src = `${PronunciationApi}${word}&type=1`
    } else if (store.wordSoundType === 'us') {
      audio.src = `${PronunciationApi}${word}&type=2`
    }
    audio.play().then(r => void 0)
}



// 重置组件状态的函数
const resetComponent = () => {
    inputeCharacters.value = characters.value.map(() => '');
    currentIndex.value = 0;
    currentCharacter.value = '';
    errorCount.value = 0; // 重置错误次数
}
// 监听所有props变化（更全面的重置）
watch(() => props, (newProps) => {
    // 仅在enwords变化时重置（如果cnwords变化不需要重置，可移除此条件）
    resetComponent();
    playSound(props.enwords)
}, { deep: true });

</script>
  
<style scoped>
.word-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.word-label {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
}

.word-sound{
    position: absolute;
    right: -20px;
    top: 28%;
    cursor: pointer;
}

.word-prompt {
    font-size: 1.5em;
    height: 100px;
}

.word-translation {
    font-size: 1.5em;
    min-height: 150px;
}

.word-display {

    height: 4rem;
    font-size: 3em;
    padding: 0 0.75rem;
    border-radius: 2px;
    border-bottom: 5px solid;
    line-height: 1;
    /* transition: all 0.1s ease; */
    text-align: center;
}

.hidden-input {
    position: absolute;
    height: 100%;
    width: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 10;
}

/* 焦点状态 */
.word-display.focused {
    color: rgb(168, 85, 247);
    border-color: rgb(168, 85, 247);
}

/* 有效状态 (失去焦点且正确) */
.word-display.valid {
    color: rgb(16, 185, 129);
    border-color: rgb(16, 185, 129);
}

/* 无效状态 (失去焦点且错误) */
.word-display.invalid {
    color: rgb(255, 0, 0);
    border-color: rgb(239, 68, 68);
}
</style>  