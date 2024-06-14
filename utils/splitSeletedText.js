import SelectionTool from "./SelectionTool.js";
import { TextNode } from "../Nodes.js/TextNode.js";
import { ImgNode } from "../Nodes.js/ImgNode.js";

/**
 * 分割选区文本
 * @returns 
 */
function splitSelectedText() {
    const selectionHtml = getSelectedHtml();

    // 将HTML插入到临时div中
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectionHtml;

    // 根据HTML结构提取文本和类名
    const textNodes = extractTextAndElementNodes(tempDiv);
    return textNodes;
}

/**
 * 处理选区文本节点
 * @returns 
 */
function getSelectedHtml() {
    let selectedHtml;
    const text = SelectionTool.getSelectionText();

    if (text.trim().length > 0) {
        const range = SelectionTool.getRangeAt();
        let documentFragment = range.cloneContents();// 克隆选区内容到一个新的文档片段中

        // 处理无直接包裹元素的选中文本，如有需要则添加包裹元素和类名
        const processedFragment = handleNodeWithNoElement(range, documentFragment) || documentFragment;

        // 将克隆的内容转换为HTML字符串
        const selectionContainer = document.createElement('div');
        selectionContainer.appendChild(processedFragment);
        selectedHtml = selectionContainer.innerHTML;
    }
    return selectedHtml;
}

/**
 * 处理无直接包裹元素的选中文本问题
 */
function handleNodeWithNoElement(range, documentFragment) {
    // 需要用到的API
    const { startContainer, endContainer, commonAncestorContainer } = range;

    // 确保文档片段中所有子节点都是文本节点
    const isTextNode = Array.from(documentFragment.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
    // 起始节点和终止节点是否拥有同一个祖先节点
    const hasCommonAncestor = startContainer === endContainer;

    // 如果节点没有返回元素，则手动添加元素和类名
    if (isTextNode && hasCommonAncestor) {
        console.log('处理符合条件的节点内容');
        const fragment = document.createDocumentFragment();
        // 遍历选区的所有节点
        Array.from(documentFragment.childNodes).forEach(node => {
            // 避免继承editor和root的类名
            let ancestor;
            if (commonAncestorContainer.nodeType === Node.ELEMENT_NODE) {
                ancestor = commonAncestorContainer;
            } else if (commonAncestorContainer.nodeType === Node.TEXT_NODE) {
                ancestor = commonAncestorContainer.parentNode;
            }
            // 祖先元素是否是editor
            let editorAncestor = ancestor.hasAttribute('class') && ancestor.classList.contains('editor');

            if (editorAncestor) {  // 如果直接在.editor下，直接添加节点
                fragment.appendChild(node);
            } else {
                // 否则创建<span>并添加相应类名
                const span = document.createElement('span');
                if (ancestor.hasAttribute('class')) {
                    span.classList.add(...ancestor.classList);
                }
                span.appendChild(node);
                fragment.appendChild(span);
            }

        })
        return fragment;
    }
}

/**
 * 提取文本的内容和属性
 * @param {*} containerElement 
 * @returns 
 */
function extractTextAndElementNodes(containerElement) {
    const textNodes = [];

    containerElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(new TextNode(node.textContent));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'span') {
                const textNode = new TextNode(node.textContent, [...node.classList]);
                textNodes.push(textNode);
            } else if (node.tagName.toLowerCase() === 'img') {
                const imgNode = new ImgNode(node.src);
                textNodes.push(imgNode);
            }
        }
    })
    return textNodes;
}

export { splitSelectedText }