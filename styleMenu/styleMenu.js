import SelectionTool from "../utils/SelectionTool.js"


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
    const textNodes = window.textNodes;

    // 确定所有选中文本节点是否都有某个类
    let textNode = [];
    textNodes.forEach(node => {
        if (node.nodeType === 'text') {
            textNode.push(node);
        }
    })
    const allHaveClassName = textNode.every(node => {
        return node.hasClassName(className);
    })

    // 根据当前状态决定添加还是移除类
    if (!allHaveClassName) {
        if (!event.target.classList.contains('addBgc')) {
            event.target.classList.add('addBgc');
            textNodes.forEach(node => {
                if (node.nodeType === 'text') {
                    node.addClassName(className);
                }
            })
        }
    } else {
        event.target.classList.remove('addBgc');
        textNodes.forEach(node => {
            if (node.nodeType === 'text') {
                node.removeClassName(className);
            }
        })
    }

    // 渲染元素
    textNodes.forEach(node => {
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
    if (ancestor.tagName.toLowerCase() === 'span') {
        processSpan(ancestor, range, fragment);
    } else {
        // 对非span元素的处理，保持原有逻辑
        range.deleteContents();
        range.insertNode(fragment);
    }
}


/**
 * 当文本的祖先元素为样式元素，分割文本节点
 * @param {*} parentNode 
 * @param {*} range 
 * @param {*} fragment 
 */
const processSpan = (parentNode, range, fragment) => {
    const classList = [...parentNode.classList];
    const textContent = parentNode.textContent;
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
    fragmentAfterSplit.appendChild(createSpan(headTextContent));
    fragmentAfterSplit.appendChild(fragment);
    fragmentAfterSplit.appendChild(createSpan(footerTextContent));

    parentNode.replaceWith(fragmentAfterSplit);
};


export default styleMenu;