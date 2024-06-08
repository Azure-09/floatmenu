import SelectionTool from "./utils/SelectionTool.js";
import Menu from "./baseMenu/Menu.js";
import baseMenu from "./baseMenu/baseMenu.js";
import styleMenu from "./styleMenu/styleMenu.js";
import { ImgNode } from "./Nodes.js/ImgNode.js";
import { TextNode } from "./Nodes.js/TextNode.js";
import { addData, getData } from "./indexedDB/index.js";
import render from "./utils/render.js";
import extractElmentNodes from "./utils/extractElmentNodes.js";
import getClassName from "./utils/getClassName.js";


const menu = new Menu();

const editorElm = document.querySelector(".editor");
const imageUpload = document.getElementById('imageUpload');
const saveButton = document.querySelector('.save');
const nav = document.querySelector('.nav');
const translateArea = document.querySelector('.translateArea');
const closeDrawer = translateArea.querySelector('.closeDrawer');

const navFloatMneu = styleMenu.concat(baseMenu);

menu.showFloatMenu(navFloatMneu, {
    floatMenuCls: 'navFloat-menu',
}, nav);


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

// 关闭抽屉
closeDrawer.addEventListener('click', handleCloseDrawer);


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
        menu.showFloatMenu(showEventMenu, { floatMenuCls: 'float-menu' });

        const floatMenuElm = menu.getFloatElm();
        const menuElms = floatMenuElm.children;
        
        // 解除禁用
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
        menu.showFloatMenu(showEventMenu, { floatMenuCls: 'float-menu' });
    }
}

async function handleContextmenu(event) {
    const rects = SelectionTool.getBoundingClientRect();
    const isMouseInRects = event.pageX >= rects.left && event.pageX <= rects.right && event.pageY >= rects.top && event.pageY <= rects.bottom;
    if (isMouseInRects) {
        menu.hideFloatMenu();
        menu.showFloatMenu(baseMenu, { floatMenuCls: 'float-menu', className: 'columnshow' });
    }
    event.preventDefault();
    menu.showFloatMenu(baseMenu, { floatMenuCls: 'float-menu', className: 'columnshow' });
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

    reader.addEventListener('load', function handleImgLoad() {
        // 当文件读取完成后，将图片以Base64格式插入到可编辑区域
        const imgNode = new ImgNode(reader.result);
        const range = SelectionTool.getRangeAt();
        range.deleteContents();
        range.insertNode(imgNode.renderImage());
        SelectionTool.updatePointPosition(range);
    });

    reader.readAsDataURL(file);
}

/**
 * ctrl+s 保存页面数据
 * @param {*} event 
 */
function handleKeydown(event) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveData();
    }
}

/**
 * 点击button保存数据
 */
function saveData() {
    const documentHTML = extractElmentNodes(editorElm);
    addData(documentHTML);
}

/**
 * 更新页面数据
 */
async function handleLoaded() {
    const data = await getData();
    const fragment = render(data);
    if (fragment.childNodes.length > 0) {
        editorElm.replaceChildren(fragment);
    }
}

/**
 * 关闭抽屉回调
 */
function handleCloseDrawer() {
    translateArea.classList.remove('drawerShow');
}

function addButtonBgcOnClick(menuItems, floatMenuCls = null) {
    const classList = getClassName(floatMenuCls);
    Array.from(menuItems).forEach((item) => {
        const type = item.getAttribute('data-type');
        if (classList[type] && !item.classList.contains('addBgc')) {
            item.classList.add('addBgc');
        }
    })
}