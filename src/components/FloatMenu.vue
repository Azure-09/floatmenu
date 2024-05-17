<template>
    <div class="box">
        <a-tooltip placement="bottom" @click="handleCopy">
            <template #title>
                <span>复制</span>
            </template>
            <a-button :disabled="props.buttonStatus.shouldSomeButtonDisabled">
                <CopyOutlined />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" @click="handlePaste">
            <template #title>
                <span>粘贴</span>
            </template>
            <a-button :disabled="props.buttonStatus.shouldPasteButtonDisabled">
                <SnippetsOutlined />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" @click="handleCut">
            <template #title>
                <span>剪切</span>
            </template>
            <a-button :disabled="props.buttonStatus.shouldSomeButtonDisabled">
                <ScissorOutlined />
            </a-button>
        </a-tooltip>
        <a-tooltip placement="bottom" @click="handleTranslate">
            <template #title>
                <span>翻译</span>
            </template>
            <a-button :disabled="props.buttonStatus.shouldSomeButtonDisabled">
                <TranslationOutlined />
            </a-button>
        </a-tooltip>
    </div>
</template>
<script setup>
import { CopyOutlined, SnippetsOutlined, ScissorOutlined, TranslationOutlined } from '@ant-design/icons-vue';
import { defineProps, defineEmits } from 'vue';

const props = defineProps(['buttonStatus']);
const emits = defineEmits(['hideFloatMenu', 'updateTranslate']);

// 获取选区文本
function getSelectionText() {
    const selection = window.getSelection();
    return selection.toString();
}

// 复制文本到剪切板
function handleCopy() {
    emits('hideFloatMenu');
    navigator.clipboard.writeText(getSelectionText());
}

// 粘贴剪切板文本
async function handlePaste() {
    emits('hideFloatMenu');
    // 获取剪切板的内容
    const pasteContent = await navigator.clipboard.readText();
    // 获取选区内容
    const selectionText = getSelectionText();
    const selection = window.getSelection();
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
    range.collapse(false); // 将 Range 折叠到其边界的端点
    selection.removeAllRanges();
    selection.addRange(range);
}

// 剪切文本
function handleCut() {
    emits('hideFloatMenu');
    // 获取选区文本
    const selectionText = getSelectionText();
    const selection = window.getSelection();
    // 将选区文本写入剪切板
    navigator.clipboard.writeText(selectionText);
    // 判断是否有选区内容
    if (selectionText.trim().length > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        // 重新设置选区
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.log('没有选区内容');
    }
}


// 翻译文本
function handleTranslate() {
    emits('hideFloatMenu');
    // 获取选区内容
    const selectContent = getSelectionText();
    // 设置默认翻译的语言
    translate.language.setDefaultTo('english');
    // 隐藏语言下拉菜单
    translate.selectLanguageTag.show = false;
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
}

.box {
    width: calc(50*4px);
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>