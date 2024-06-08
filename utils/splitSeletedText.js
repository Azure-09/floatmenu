import SelectionTool from "./SelectionTool.js";
import { TextNode } from "../Nodes.js/TextNode.js";

function splitSelectedText() {
    const selectionHtml = getSelectedHtml();
    // 将HTML插入到临时div中
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = selectionHtml;

    // 根据HTML结构提取文本和类名
    const textNodes = extractTextAndElementNodes(tempDiv);

    return textNodes;
}

function getSelectedHtml() {
    let selectedHtml = '';
    const selection = SelectionTool.getSelection();
    if (selection.rangeCount > 0) {
        const range = SelectionTool.getRangeAt();
        const clonedSelection = range.cloneContents(); // 克隆选区内容到一个新的文档片段中

        // 将克隆的内容转换为HTML字符串
        const selectionContainer = document.createElement('div');
        selectionContainer.appendChild(clonedSelection);
        selectedHtml = selectionContainer.innerHTML;
    }
    return selectedHtml;
}

function extractTextAndElementNodes(containerElement) {
    const textNodes = [];
    containerElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(new TextNode(node.textContent));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const newNode = new TextNode(node.textContent, [...node.classList]);
            textNodes.push(newNode);
        }
    })
    return textNodes;
}


export { splitSelectedText }