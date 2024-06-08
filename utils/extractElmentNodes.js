import { TextNode } from "../Nodes.js/TextNode.js";
import { ImgNode } from "../Nodes.js/ImgNode.js";
/**
 * 提取元素节点信息
 * @param {*} containerElement 
 * @param {*} documentHTML 
 */
function extractElmentNodes(containerElement) {
    const documentHTML = [];
    containerElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const textNode = new TextNode(node.textContent);
            documentHTML.push(textNode);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName.toLowerCase() === 'span') {
                const textNode = new TextNode(node.textContent, [...node.classList]);
                documentHTML.push(textNode);
            } else if (node.tagName.toLowerCase() === 'img') {
                const imgNode = new ImgNode(node.src);
                documentHTML.push(imgNode);
            }
        }
    })
    return documentHTML;
}

export default extractElmentNodes;