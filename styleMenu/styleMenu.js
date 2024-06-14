import SelectionTool from "../utils/SelectionTool.js";
import allHaveTextDecoraction from "../utils/allHaveTextDecoraction.js";


const styleMenu = [
    { type: 'weight', text: '加粗', onClick: () => addOrRemoveClassName('bold_font') },
    { type: 'italic', text: '斜体', onClick: () => addOrRemoveClassName('italic_font') },
    { type: 'underline', text: '下划线', onClick: () => addOrRemoveClassName('underline_font') },
    { type: 'lineThrough', text: '删除线', onClick: () => addOrRemoveClassName('linethrough_font') },
    { type: 'color', text: '字体颜色', onClick: () => addOrRemoveClassName('color_font') },
    { type: 'highlightShow', text: '高亮显示', onClick: () => addOrRemoveClassName('bg_font') }
]


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

        // 确定所有选中文本节点是否都有某个类
        const allHaveClassName = textNodes.every(node => {
            return node.hasClassName(className);
        })

        // 选区文本是否有text-decoration样式
        const underline = event.target.dataset.type === 'underline' || event.target.dataset.type === 'lineThrough';
        if (underline) {
            window.allHaveTextDecoraction = allHaveTextDecoraction(event, textNodes);
        }

        // 选区文本是否有underlineAndLinethrough样式
        const underlineAndLinethrough = textNodes.every(textNodes => {
            return textNodes.hasClassName('underlineAndLinethrough');
        })


        // 根据当前状态决定添加还是移除类
        if (!allHaveClassName) {  // 不存在某个类（underLineAndLinethrough)
            if (event.target.classList.contains('addBgc')) return;

            event.target.classList.add('addBgc');
            // 检查是否不需要处理下划线和删除线
            if (!underlineAndLinethrough) {
                textNodes.forEach(textNodes => textNodes.addClassName(className));
            } else {
                const eventType = event.target.dataset.type;
                let siblingSelector, targetClass;

                // 根据类型决定要移除的背景色目标及添加的新类名
                if (eventType === 'underline') {
                    siblingSelector = 'nextSibling';
                    targetClass = 'addBgcWhenHasTextdecoration'
                    textNodes.forEach(textNode => {
                        textNode.addClassName('linethrough_font');
                        textNode.removeClassName('underlineAndLinethrough');
                    })
                } else if (eventType === 'lineThrough') {
                    siblingSelector = 'previousSibling';
                    targetClass = 'addBgcWhenHasTextdecoration'
                    textNodes.forEach(textNode => {
                        textNode.addClassName('underline_font');
                        textNode.removeClassName('underlineAndLinethrough');
                    });
                }

                // 移除指定元素的背景色类
                if (siblingSelector && targetClass) {
                    event.target.classList.remove(targetClass);
                    event.target[siblingSelector].classList.remove(targetClass);
                }

            }

        } else {
            event.target.classList.remove('addBgc');
            textNodes.forEach(textNodes => textNodes.removeClassName(className));

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


export default styleMenu;