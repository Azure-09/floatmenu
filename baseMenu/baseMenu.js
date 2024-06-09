import SelectionTool from "../utils/SelectionTool.js";

const baseMenu = [
    { type: 'copy', text: '复制', onClick: handleCopy },
    { type: 'paste', text: '粘贴', onClick: handlePaste },
    { type: 'cut', text: '剪切', onClick: handleCut },
    { type: 'translate', text: '翻译', onClick: handleTranslate },
    { type: 'addImg', text: '插图', onClick: handleAddImg },
]

/**
 * 复制功能
 */
function handleCopy() {
    navigator.clipboard.writeText(SelectionTool.getSelectionText());
}

/**
 * 粘贴功能
 */
async function handlePaste() {
    // 获取剪切板的内容
    const pasteContent = await navigator.clipboard.readText();
    // 获取选区内容
    const selectionText = SelectionTool.getSelectionText();
    const range = SelectionTool.getRangeAt();
    // 判断选区
    if (selectionText.trim().length > 0) {
        // 清除选区的内容
        range.deleteContents();
    }
    // 创建虚拟节点
    const textNode = document.createTextNode(pasteContent);
    // 将文本插入到光标位置
    range.insertNode(textNode);
    SelectionTool.updatePointPosition(range);
}

/**
 * 剪切功能
 */
function handleCut() {
    // 获取选区文本
    const selectionText = SelectionTool.getSelectionText();
    // 将选区文本写入剪切板
    navigator.clipboard.writeText(selectionText);
    // 判断是否有选区内容
    if (selectionText.trim().length > 0) {
        const range = SelectionTool.getRangeAt();
        range.deleteContents();
        SelectionTool.updatePointPosition(range);
    } else {
        console.log('没有选区内容');
    }
}

/**
 * 翻译功能
 */
function handleTranslate() {
    const translateText = document.querySelector('.translateText');
    const translateArea = document.querySelector('.translateArea');
    translateArea.style.visibility = 'visible';
    // 获取选区内容
    const selectContent = SelectionTool.getSelectionText();
    // 设置默认翻译的语言
    translate.language.setDefaultTo('english');
    // 隐藏语言下拉菜单
    translate.selectLanguageTag.show = false;
    translate.service.use('client.edge');
    // 翻译选区内容
    if (selectContent) {
        translate.request.translateText(selectContent, function (data) {
            translateText.textContent = data.text;
            const hasClassName = translateArea.classList.contains('drawerShow');
            if (!hasClassName) {
                translateArea.classList.add('drawerShow');
            }
        })
    } else {
        console.log('不存在内容');
    }
}

function handleAddImg() {
    document.getElementById('imageUpload').click();
}

export default baseMenu;