<template>
    <div class="root">
        <div class="editor" contenteditable="true" @mousedown="handleMousedown" @mouseup="handleMouseup"
            @click="handleClick" @dragstart="handleDragstart" @dragend="handleDragend" @contextmenu="handleContextmenu">
            不久前，在中国空间站，神舟十五号航天员乘组进行了第四次出舱活动，刷新了中国航天员单个乘组出舱活动纪录。
            　　航天员在空间站忙碌的同时，在海南文昌，天舟六号货运飞船和长征七号遥七火箭正在进行调试，计划今年5月实施发射，给正在太空运行的中国空间站送上补给。
            　　勇攀科技高峰是习近平总书记对我国航天事业发展的殷殷嘱托。党的十八大以来，总书记多次亲临航天发射场，和航天员亲切通话，会见航天参研参试队伍。他指出，航天梦是强国梦的重要组成部分，随着中国航天事业快速发展，中国人探索太空的脚步会迈得更大、更远。
            不久前，在中国空间站，神舟十五号航天员乘组进行了第四次出舱活动，刷新了中国航天员单个乘组出舱活动纪录。
            　　航天员在空间站忙碌的同时，在海南文昌，天舟六号货运飞船和长征七号遥七火箭正在进行调试，计划今年5月实施发射，给正在太空运行的中国空间站送上补给。
            　　勇攀科技高峰是习近平总书记对我国航天事业发展的殷殷嘱托。党的十八大以来，总书记多次亲临航天发射场，和航天员亲切通话，会见航天参研参试队伍。他指出，航天梦是强国梦的重要组成部分，随着中国航天事业快速发展，中国人探索太空的脚步会迈得更大、更远。
        </div>
        <div class="translateArea">
            {{ translateText }}
        </div>
    </div>
    <FloatMenu ref="floatmenu" class="float" v-show="menuStatus.showFloatMenuOnClick" @updateTranslate="updateTranslate"
        :style="{ left: floatmenuPosition.left, top: floatmenuPosition.top }" @hideFloatMenu="hideFloatMenu"
        :buttonStatus="buttonStatus" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import FloatMenu from './components/FloatMenu.vue';

// 菜单状态
const menuStatus = reactive({
    hasSelectionContentOnMousedown: false,
    showFloatMenuOnClick: false,
    isDragOnDragStart: false,
    shouldShowMenuOnDragend: false,
});


// 更新翻译文本
const translateText = ref('翻译后的内容~');

function updateTranslate(text) {
    translateText.value = text;
}


// 设置菜单位置
const floatmenuPosition = reactive({ left: 0, top: 0 });

function setMenuElmPosition(x, y) {
    const selection = window.getSelection();
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const menuElmWidth = 200 / 2;
    const menuElmHeight = 50;
    // 判断选区的位置
    if (selection.isCollapsed) {
        floatmenuPosition.left = (rect.right || x) + "px";
        floatmenuPosition.top = (rect.bottom || y) + "px";
    } else if (selection.anchorOffset < selection.focusOffset) {
        floatmenuPosition.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
        floatmenuPosition.top = rect.bottom + window.scrollY + 10 + "px";
    } else if (selection.anchorOffset > selection.focusOffset) {
        floatmenuPosition.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
        floatmenuPosition.top = rect.top + window.scrollY - menuElmHeight - 10 + "px";
    }
}

// 显示菜单
function showFloatMenu(x, y) {
    setMenuElmPosition(x, y);
    menuStatus.showFloatMenuOnClick = true;
}


// 隐藏菜单
function hideFloatMenu() {
    menuStatus.showFloatMenuOnClick = false;
}

// 获取选区文本
function getSelectionText() {
    const selection = window.getSelection();
    return selection.toString();
}

// 鼠标按下时改变选区状态
function handleMousedown() {
    setTimeout(() => {
        menuStatus.hasSelectionContentOnMousedown = getSelectionText().length > 0;
    }, 0);
}

// 鼠标弹起改变菜单状态
function handleMouseup() {
    const { hasSelectionContentOnMousedown } = menuStatus;
    const selectionText = getSelectionText();
    menuStatus.showFloatMenuOnClick = !hasSelectionContentOnMousedown && selectionText.length !== 0;
    menuStatus.isDragOnDragStart = false;
}

// 点击事件--->显示菜单
async function handleClick(event) {
    const { showFloatMenuOnClick } = menuStatus;
    if (showFloatMenuOnClick) {
        showFloatMenu(event.pageX, event.pageY);
        // 解除禁用
        const clipboardText = await navigator.clipboard.readText();
        if (getSelectionText().trim().length > 0) {
            buttonStatus.shouldSomeButtonDisabled = false;
            if (!clipboardText) {
                buttonStatus.shouldPasteButtonDisabled = true;
            } else {
                buttonStatus.shouldPasteButtonDisabled = false;
            }
        }
    } else {
        hideFloatMenu();
    }
}


onMounted(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    document.documentElement.style.backgroundColor = '#eee';
})


// 监听文本变化事件(在当前Document的Selection改变时触发，此事件不可取消，也不会冒泡)
// 解决 拖选开始没有取消显示菜单，也可以用来根据有无选区隐藏菜单
function handleSelectionChange(event) {
    const selectionText = getSelectionText();
    if (!selectionText) {
        hideFloatMenu();
    }
}

// 解决 拖拽选中的内容时菜单不消失
// 期望：拖拽选中的内容时菜单消失，拖拽完成后菜单重新显示
function handleDragstart(event) {
    if (menuStatus.showFloatMenuOnClick) {
        menuStatus.shouldShowMenuOnDragend = true;
        hideFloatMenu();
    } else {
        menuStatus.shouldShowMenuOnDragend = false;
    }
}

function handleDragend(event) {
    const { shouldShowMenuOnDragend } = menuStatus;
    if (shouldShowMenuOnDragend) {
        showFloatMenu(event.pageX, event.pageY);
    }
}

// 右键显示菜单
const buttonStatus = reactive({
    shouldSomeButtonDisabled: false,
    shouldPasteButtonDisabled: false
})
async function handleContextmenu(event) {
    event.preventDefault();
    showFloatMenu(event.pageX, event.pageY);
    // 禁用部分按钮
    const clipboardText = await navigator.clipboard.readText();
    if (getSelectionText().trim().length <= 0) {
        buttonStatus.shouldSomeButtonDisabled = true;
        if (!clipboardText) {
            buttonStatus.shouldPasteButtonDisabled = true;
        } else {
            buttonStatus.shouldPasteButtonDisabled = false;
        }
    }
}



</script>

<style scoped>
@import '../public/assets/css/style.css';

.float {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
