<template>
    <div class="box">
        <MneuItems v-for="item in menuitems" :key="item.text" @click="onClick(item.onclick)">
            <template #text>
                <span>{{ item.text }}</span>
            </template>
            <template #button>
                <a-button :disabled="item.text === '粘贴' ? shouldPasteButtonDisabled : shouldSomeButtonDisabled">
                    <component :is="item.icon" />
                </a-button>
            </template>
        </MneuItems>
    </div>
</template>

<script setup>
import { CopyOutlined, SnippetsOutlined, ScissorOutlined, TranslationOutlined } from '@ant-design/icons-vue';
import MneuItems from './MneuItems.vue';
import { reactive, watchEffect, nextTick, ref } from 'vue';
import selectionTool from '../utils/selectionTool';

const props = defineProps(['buttonStatus']);
const shouldPasteButtonDisabled = ref(false);
const shouldSomeButtonDisabled = ref(false);
const emits = defineEmits(['hideFloatMenu', 'updateTranslate']);


watchEffect(() => {
    nextTick();
    shouldPasteButtonDisabled.value = props.buttonStatus.shouldPasteButtonDisabled;
    shouldSomeButtonDisabled.value = props.buttonStatus.shouldSomeButtonDisabled;
})

const menuitems = reactive([
    { text: '复制', icon: CopyOutlined, onclick: handleCopy },
    { text: '粘贴', icon: SnippetsOutlined, onclick: handlePaste },
    { text: '剪切', icon: ScissorOutlined, onclick: handleCut },
    { text: '翻译', icon: TranslationOutlined, onclick: handleTranslate },
])


function onClick(callback) {
    callback();
    emits('hideFloatMenu');
}

// 复制文本到剪切板
function handleCopy() {
    navigator.clipboard.writeText(selectionTool.getSelectionText());
}

// 粘贴剪切板文本
async function handlePaste() {
    // 获取剪切板的内容
    const pasteContent = await navigator.clipboard.readText();
    // 获取选区内容
    const selectionText = selectionTool.getSelectionText();
    const selection = selectionTool.getSelection();
    const range = selection.getRangeAt(0);
    // 如果有选区
    if (selectionText.trim().length > 0) {
        // 清除选区的内容
        range.deleteContents();
    }
    // 创建虚拟节点
    const textNode = document.createTextNode(pasteContent);
    // 将文本插入到光标位置
    range.insertNode(textNode);
    // 保持光标位置在插入文本之后
    selectionTool.updatePointPosition(range, selection);
}

// 剪切文本
function handleCut() {
    // 获取选区文本
    const selectionText = selectionTool.getSelectionText();
    const selection = selectionTool.getSelection();
    // 将选区文本写入剪切板
    navigator.clipboard.writeText(selectionText);
    // 判断是否有选区内容
    if (selectionText.trim().length > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        // 重新设置选区
        selectionTool.updatePointPosition(range, selection);
    } else {
        console.log('没有选区内容');
    }
}


// 翻译文本
function handleTranslate() {
    // 获取选区内容
    const selectContent = selectionTool.getSelectionText();
    // 设置默认翻译的语言
    translate.language.setDefaultTo('english');
    // 隐藏语言下拉菜单
    translate.selectLanguageTag.show = false;
    // 切换v3版本，更稳定
    translate.service.use('client.edge');
    // 翻译选区内容
    if (selectContent) {
        translate.request.translateText(selectContent, function (data) {
            emits('updateTranslate', data.text[0]);
            // console.log(data);
        })
    } else {
        console.log('不存在内容');
    }
}

</script>
<style scoped>
.ant-btn {
    width: 50px;
    height: 50px;
    text-align: center;
    font-size: 20px;
    padding: 0;
    border: none;
    background-color: #fff;
}

.box {
    width: calc(50*4px);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: #fff;
}
</style>