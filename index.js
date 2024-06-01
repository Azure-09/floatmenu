import SelectionTool from "./utils/SelectionTool.js";
import Menu from "./baseMenu/Menu.js";
import baseMenu from "./baseMenu/baseMenu.js";
import styleMenu from "./styleMenu/styleMenu.js";
import { ImgNode } from "./Nodes.js/ImgNode.js";
import { TextNode } from "./Nodes.js/TextNode.js";


const menu = new Menu();

const editorElm = document.querySelector(".editor");
const imageUpload = document.getElementById('imageUpload');
const saveButton = document.querySelector('.save');


// 事件菜单
const showEventMenu = styleMenu;


// 鼠标按下事件--->改变选区状态
editorElm.addEventListener("mousedown", handleMousedown);

// 鼠标弹起事件--->改变显示菜单的状态
editorElm.addEventListener("mouseup", handleMouseup);

// 点击事件--->显示菜单
editorElm.addEventListener("click", handleClick);

// 解决 拖拽选中的内容时菜单不消失
// 期望：拖拽选中的内容时菜单消失，拖拽完成后菜单重新显示
editorElm.addEventListener('dragstart', handleDragstart);

editorElm.addEventListener('dragend', handleDragend);

// 右键显示菜单
editorElm.addEventListener('contextmenu', handleContextmenu);

// 监听文本变化事件(在当前Document的Selection改变时触发，此事件不可取消，也不会冒泡)
// 解决 拖选开始没有取消显示菜单，也可以用来根据有无选区隐藏菜单
document.addEventListener("selectionchange", handleSelectionChange);

// 上传文件
imageUpload.addEventListener('change', handleImageUpload);

// 保存文档数据
document.addEventListener('keydown', handleKeydown);
saveButton.addEventListener('click', saveData);

// 加载文档数据
document.addEventListener('DOMContentLoaded', handleLoaded);


/**
 * 
 * 事件回调函数
 */
function handleMousedown(event) {
    // 鼠标按下事件完成后，这时是空选区，修改选区文本状态
    setTimeout(() => {
        menu.menuStatus.hasSelectionContentOnMousedown = SelectionTool.getSelectionText().length > 0;
    }, 0);
}

function handleMouseup(event) {
    const { hasSelectionContentOnMousedown } = menu.menuStatus;
    const selectionText = SelectionTool.getSelectionText();
    menu.menuStatus.showFloatMenuOnClick = !hasSelectionContentOnMousedown && selectionText.length !== 0;
    menu.menuStatus.isDragOnDragStart = false;
}

async function handleClick(event) {
    const { showFloatMenuOnClick } = menu.menuStatus;
    if (showFloatMenuOnClick) {
        menu.showFloatMenu(showEventMenu);
        // 解除禁用
        const floatMenuElm = menu.getFloatElm();
        const menuElms = floatMenuElm.children;
        const clipboardText = await navigator.clipboard.readText();
        Array.from(menuElms).filter(menuElm => {
            const type = menuElm.getAttribute('data-type') === "paste";
            const imgtype = menuElm.getAttribute('data-type') === "addImg";
            if (!type && !imgtype) {
                menuElm.classList.remove('disabled', 'disabledBgc');
            } else {
                clipboardText ? menuElm.classList.remove('disabled') : menuElm.classList.add('disabled');
            }
        })
    } else {
        menu.hideFloatMenu();
    }
}

function handleSelectionChange(event) {
    const selectionText = SelectionTool.getSelectionText();
    if (!selectionText) {
        menu.hideFloatMenu();
    }
}

function handleDragstart(event) {
    if (menu.isMenuShow()) {
        menu.menuStatus.shouldShowMenuOnDragend = true;
        menu.hideFloatMenu();
    } else {
        menu.menuStatus.shouldShowMenuOnDragend = false;
    }
}

function handleDragend(event) {
    const { shouldShowMenuOnDragend } = menu.menuStatus;
    if (shouldShowMenuOnDragend) {
        menu.showFloatMenu(showEventMenu);
    }
}

async function handleContextmenu(event) {
    const rects = SelectionTool.getBoundingClientRect();
    const isMouseInRects = event.pageX >= rects.left && event.pageX <= rects.right && event.pageY >= rects.top && event.pageY <= rects.bottom;
    if (isMouseInRects) {
        menu.hideFloatMenu();
        menu.showFloatMenu(baseMenu);
    }
    event.preventDefault();
    menu.showFloatMenu(baseMenu);
    // 禁用部分按钮
    const floatMenuElm = menu.getFloatElm();
    const menuElms = floatMenuElm.children;
    const clipboardText = await navigator.clipboard.readText();
    if (SelectionTool.getSelectionText().trim().length <= 0) {
        Array.from(menuElms).filter(menuElm => {
            const type = menuElm.getAttribute('data-type') === "paste";
            const imgtype = menuElm.getAttribute('data-type') === "addImg";
            if (!type && !imgtype) {
                menuElm.classList.add('disabled', 'disabledBgc');
            } else {
                clipboardText ? menuElm.classList.remove('disabled') : menuElm.classList.add('disabled');
            }
        })
    }
}

/**
 * 文件上传功能
 */
function handleImageUpload(event) {
    var file = event.target.files[0];
    if (!file) return;

    var reader = new FileReader();

    reader.addEventListener('load', handleImgLoad);

    reader.readAsDataURL(file);
}

/**
 * 保存页面数据
 * @param {*} event 
 */
function handleKeydown(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveData();
    }
}

function saveData() {
    const documentHTML = [];
    extractElmentNodes(editorElm, documentHTML);
    localStorage.setItem('documentHTML', JSON.stringify(documentHTML));
}

/**
 * 加载图片
 * @param {*} event 
 */
function handleImgLoad(event) {
    // 当文件读取完成后，将图片以Base64格式插入到可编辑区域
    const imgNode = new ImgNode(reader.result);
    const range = SelectionTool.getRangeAt();
    range.deleteContents();
    range.insertNode(imgNode.createImage());
    SelectionTool.updatePointPosition(range);
}

/**
 * 更新页面数据
 */
function handleLoaded() {
    const fragment = document.createDocumentFragment();
    const documentHTML = JSON.parse(localStorage.getItem('documentHTML'));

    if (documentHTML) {
        documentHTML.forEach(node => {
            if (node.tagName === 'text') {
                const { textContent, classNames } = node;
                if (classNames.length <= 0) {
                    fragment.appendChild(document.createTextNode(textContent));
                } else {
                    const element = document.createElement('span');
                    element.textContent = textContent;
                    element.classList.add(...classNames);
                    fragment.appendChild(element);
                }
            } else if (node.tagName === 'img') {
                const img = document.createElement('img');
                img.src = node.src;
                img.style.maxWidth = '100%';
                fragment.appendChild(img);
            }
        })
        editorElm.replaceChildren(fragment);
    }
}


/**
 * 提取元素节点信息
 * @param {*} containerElement 
 * @param {*} documentHTML 
 */
function extractElmentNodes(containerElement, documentHTML) {
    containerElement.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            documentHTML.push(new TextNode(node.textContent));
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
}