import SelectionTool from "../utils/SelectionTool.js";


const styleMenu = [
    { type: 'weight', text: '加粗', onClick: () => addOrRemoveClassName('bold_font') },
    { type: 'italic', text: '斜体', onClick: () => addOrRemoveClassName('italic_font') },
    { type: 'underline', text: '下划线', onClick: () => addOrRemoveClassName('underline_font') },
    { type: 'lineThrough', text: '删除线', onClick: () => addOrRemoveClassName('linethrough_font') },
    { type: 'color', text: '字体颜色', onClick: () => addOrRemoveClassName('color_font') },
    { type: 'highlightShow', text: '高亮显示', onClick: () => addOrRemoveClassName('bg_font') }
]

const underlineAndLinethrough = 'underlineAndLinethrough';

function addOrRemoveClassName(className) {
    const nodeSet = window.nodeSet;
    const range = SelectionTool.getRangeAt();
    const fragment = document.createDocumentFragment();

    if (!range.collapsed) {
        // 集合所有文本节点
        let textNodes = [];
        nodeSet.forEach(node => {
            if (node.nodeType === 'text') {
                textNodes.push(node);
            }
        })


        // 都有特定类
        const allHaveClassName = allHaveSomeClassName(textNodes, className);
        // 都有下划线
        const allHaveUnderline = allHaveSomeClassName(textNodes, 'underline_font');
        // 都有删除线
        const allHaveLinethrough = allHaveSomeClassName(textNodes, 'linethrough_font');
        // 都有underlineAndLinethrough样式
        const allHaveUnderlineAndLinethrough = allHaveSomeClassName(textNodes, underlineAndLinethrough);



        const eventType = event.target.dataset.type;
        // 根据当前状态决定添加还是移除类
        if (!allHaveClassName) {
            event.target.classList.add('addBgc');
            toggleTextDecoration(eventType, textNodes, 'addClassName', className);
        } else {
            event.target.classList.remove('addBgc');
            toggleTextDecoration(eventType, textNodes, 'removeClassName', className);
        }



        /**
         * 处理textDecoration被覆盖的问题
         */
        // 检查是否需要处理下划线和删除线
        // 添加underlineAndLinethrough类
        const addTextDecoration = allHaveUnderline && eventType === 'lineThrough' || allHaveLinethrough && eventType === 'underline';
        if (addTextDecoration) {
            textNodes.forEach(textNode => textNode.addClassName(underlineAndLinethrough));
        };

        // 移除underlineAndLinethrough类
        if (allHaveUnderlineAndLinethrough) {
            const removeTextDecoration = eventType === 'underline' || eventType === 'lineThrough';
            if (removeTextDecoration) {
                textNodes.forEach(textNode => textNode.removeClassName(underlineAndLinethrough));
            }
        }



        // 渲染元素
        nodeSet.forEach(node => {
            if (node.nodeType === 'text') {
                fragment.appendChild(node.renderElement());
            } else if (node.nodeType === 'img') {
                fragment.appendChild(node.renderImage());
            }
        })



        let ancestor = range.commonAncestorContainer;
        if (ancestor.nodeType !== Node.ELEMENT_NODE) {
            ancestor = ancestor.parentNode;
        }

        // 当文本的祖先元素为样式元素，分割文本节点
        if (ancestor.nodeName.toLowerCase() === 'span') {
            processSpan(ancestor, range, fragment);
        } else {
            // 对非span元素的处理，保持原有逻辑
            range.deleteContents();
            range.insertNode(fragment);
        }
    }

}


/**
 * 当文本的祖先元素为样式元素，分割文本节点
 * @param {*} ancestor 
 * @param {*} range 
 * @param {*} fragment 
 */
const processSpan = (ancestor, range, fragment) => {
    const classList = [...ancestor.classList];
    const textContent = ancestor.textContent;
    const [headTextContent, footerTextContent] = textContent.split(range.toString());

    // 创建新的span元素
    const createSpan = (content) => {
        const span = document.createElement('span');
        span.classList.add(...classList);
        span.textContent = content;
        return span;
    };

    // 依次将分割的文本节点插入文档
    const fragmentAfterSplit = document.createDocumentFragment();
    const text = fragment.firstChild;
    fragmentAfterSplit.appendChild(createSpan(headTextContent));
    fragmentAfterSplit.appendChild(text);
    fragmentAfterSplit.appendChild(createSpan(footerTextContent));

    // 替换祖先元素
    ancestor.replaceWith(fragmentAfterSplit);
    // 设置选区
    const sel = SelectionTool.getSelection();
    const newRange = new Range();
    newRange.selectNode(text);
    sel.removeAllRanges();
    sel.addRange(newRange);
};


// 是否都含有某个类
function allHaveSomeClassName(textNodes, className) {
    return textNodes.every(textNode => textNode.hasClassName(className));
}

// 处理文本中部分存在textdecortion的文本
function toggleTextDecoration(eventType, textNodes, classType, className) {
    textNodes.forEach(textNode => {
        // 根据某个文本元素是否存在textdecoration属性添加underlineAndLinethrough类
        const hasTextDecoration = textNode.hasClassName('underline_font') && eventType === 'lineThrough' || textNode.hasClassName('linethrough_font') && eventType === 'underline';
        if (hasTextDecoration) {
            textNode[classType](underlineAndLinethrough);
        }

        textNode[classType](className);
    });
}

export default styleMenu;