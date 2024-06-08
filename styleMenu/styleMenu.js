import SelectionTool from "../utils/SelectionTool.js"
import { splitSelectedText } from "../utils/splitSeletedText.js";


const styleMenu = [
    { type: 'weight', text: '加粗', onClick: () => addOrRemoveClassName('bold_font') },
    { type: 'italic', text: '斜体', onClick: () => addOrRemoveClassName('italic_font') },
    { type: 'underline', text: '下划线', onClick: () => addOrRemoveClassName('underline_font') },
    { type: 'lineThrough', text: '删除线', onClick: () => addOrRemoveClassName('linethrough_font') },
    { type: 'color', text: '字体颜色', onClick: () => addOrRemoveClassName('color_font') },
    { type: 'highlightShow', text: '高亮显示', onClick: () => addOrRemoveClassName('bg_font') }
]


function addOrRemoveClassName(className) {
    const range = SelectionTool.getRangeAt();
    const fragment = document.createDocumentFragment();
    const textNodes = splitSelectedText();

    // 确定所有选中文本节点是否都有某个类
    const allHaveClassName = textNodes.every(textNode => textNode.hasClassName(className));

    // 根据当前状态决定添加还是移除类
    if (!allHaveClassName) {
        if (!event.target.classList.contains('addBgc')) {
            event.target.classList.add('addBgc');
        }

        textNodes.forEach(textNode => {
            textNode.addClassName(className);
            fragment.appendChild(textNode.renderElement());
        })
    } else {
        event.target.classList.remove('addBgc');
        textNodes.forEach(textNode => {
            textNode.removeClassName(className);
            fragment.appendChild(textNode.renderElement());
        });
    }
    // 清除原有内容并插入新内容
    range.deleteContents();
    range.insertNode(fragment);
}


export default styleMenu;