/**
 * 剪切板工具：提供写入剪切板、读取剪切板API
 */
class ClipboardTool {

    static writeText(text) {
        navigator.clipboard.writeText(text);
    }

    // static async readText() {
    //     navigator.clipboard.readText().then(res=>{
    //         var text = res;
    //     });
    //     console.log(text);
    // }
}

/**
 * 选区工具：提供获取选区位置、获取选区图形、更新光标位置API
 */
class SelectionTool {
    static getSelectionText() {
        return this.getSelection().toString();
    }

    static getBoundingClientRect() {
        return this.getSelection().getRangeAt(0).getBoundingClientRect();
    }

    static updatePointPosition(range, selection) {
        range.collapse(false); // 将 Range 折叠到其边界的端点
        selection.removeAllRanges();
        selection.addRange(range);
    }

    static getSelection() {
        return window.getSelection();
    }
}

/**
 * 生成菜单选项
 */
class MenuItem {

    constructor({ menuItem, onClick }) {
        const { type, text } = menuItem;
        this.type = type;
        this.text = text;
        this.onClick = onClick;
    }

    createItems() {
        const itemElm = document.createElement("div");
        itemElm.appendChild(document.createTextNode(this.text));
        itemElm.setAttribute('data-type', this.type);
        itemElm.classList.add("menu-item");
        itemElm.addEventListener('click', this.onClick);
        return itemElm;
    }
}

/**
 * 菜单模块：根据菜单选项提供复制、粘贴、剪切、翻译功能
 */
class Menu {

    // 菜单状态
    menuStatus = {
        hasSelectionContentOnMousedown: false,
        showFloatMenuOnClick: false,
        isDragOnDragStart: false,
        shouldShowMenuOnDragend: false,
    };

    floatMenuCls = "float-menu";

    constructor(menuItems) {
        this.menuItems = menuItems;
    }

    // 设置菜单位置
    setMenuElmPosition(menuElm) {
        // if (!SelectionTool.getSelectionText()) {
        //     menuElm.style.left = 0;
        //     menuElm.style.top = 0;
        //     return;
        // }
        const selection = SelectionTool.getSelection();
        const { isCollapsed, anchorOffset, focusOffset } = selection;
        const rect = SelectionTool.getBoundingClientRect();
        const menuElmWidth = menuElm.offsetWidth / 2;
        // 判断选区的位置
        if (isCollapsed) {
            menuElm.style.left = (rect.right) + "px";
            menuElm.style.top = (rect.bottom) + "px";
        } else if (anchorOffset < focusOffset) {
            menuElm.style.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
            menuElm.style.top = rect.bottom + window.scrollY + 10 + "px";
        } else if (anchorOffset > focusOffset) {
            menuElm.style.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
            menuElm.style.top = rect.top + window.scrollY - menuElm.offsetHeight - 10 + "px";
        }
    }

    // 创建菜单
    createFloatMenu(menuItems) {
        let floatMenuElm = this.getFloatElm();
        if (!floatMenuElm) {
            floatMenuElm = document.createElement("div");
            floatMenuElm.classList.add(this.floatMenuCls);
            menuItems.forEach((menuItem) => {
                const itemElm = new MenuItem({
                    menuItem,
                    onClick: () => {
                        this.hideFloatMenu();
                        menuItem.onClick();
                    }
                });
                floatMenuElm.appendChild(itemElm.createItems());
            });
            document.body.appendChild(floatMenuElm);
        }
        return floatMenuElm;
    }

    // 获取菜单
    getFloatElm() {
        return document.querySelector("." + this.floatMenuCls);
    }


    // 显示菜单
    showFloatMenu(menuItems) {
        const menuElm = this.createFloatMenu(menuItems);
        menuElm.classList.add("show");

        // 设置菜单位置
        this.setMenuElmPosition(menuElm);
    }

    // 隐藏菜单
    hideFloatMenu() {
        const floatMenuElm = this.getFloatElm();
        if (floatMenuElm) {
            floatMenuElm.classList.remove("show");
        }
    }

    // 是否显示菜单
    isMenuShow() {
        const menuElm = this.getFloatElm();
        return menuElm.classList.contains('show');
    }

}
const menu = new Menu();

const items = [
    { type: 'edit', text: '编辑', onClick: edit },
    { type: 'edit', text: '编辑', onClick: edit },
    { type: 'edit', text: '编辑', onClick: edit },
    { type: 'edit', text: '编辑', onClick: edit },
]

// menu.showFloatMenu(items);

const menuItems = [
    { type: 'copy', text: '复制', onClick: handleCopy },
    { type: 'paste', text: '粘贴', onClick: handlePaste },
    { type: 'cut', text: '剪切', onClick: handleCut },
    { type: 'translate', text: '翻译', onClick: handleTranslate },
]

// 事件菜单
const showEventMenu = menuItems;

function edit() {
    console.log('编辑');
}


function handleCopy() {
    ClipboardTool.writeText(SelectionTool.getSelectionText());
}

async function handlePaste() {
    // 获取剪切板的内容
    const pasteContent = await navigator.clipboard.readText();
    // 获取选区内容
    const selectionText = SelectionTool.getSelectionText();
    const selection = SelectionTool.getSelection();
    const range = selection.getRangeAt(0);
    // 判断选区
    if (selectionText.trim().length > 0) {
        // 清除选区的内容
        range.deleteContents();
    }
    // 创建虚拟节点
    const textNode = document.createTextNode(pasteContent);
    // 将文本插入到光标位置
    range.insertNode(textNode);
    SelectionTool.updatePointPosition(range, selection);
}

function handleCut() {
    // 获取选区文本
    const selectionText = SelectionTool.getSelectionText();
    const selection = SelectionTool.getSelection();
    // 将选区文本写入剪切板
    ClipboardTool.writeText(selectionText);
    // 判断是否有选区内容
    if (selectionText.trim().length > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        SelectionTool.updatePointPosition(range, selection);
    } else {
        console.log('没有选区内容');
    }
}

function handleTranslate() {
    const translateArea = document.querySelector('.translateArea');
    // 获取选区内容
    const selectContent = SelectionTool.getSelectionText();
    // 设置默认翻译的语言
    translate.language.setDefaultTo('english');
    // 隐藏语言下拉菜单
    translate.selectLanguageTag.show = false;
    // 翻译选区内容
    if (selectContent) {
        translate.request.translateText(selectContent, function (data) {
            translateArea.textContent = data.text[0];
            // console.log(data);
        })
    } else {
        console.log('不存在内容');
    }
}



const editorElm = document.querySelector(".editor");

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
            if (!type) {
                menuElm.classList.remove('disabled');
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
    event.preventDefault();
    menu.showFloatMenu(showEventMenu);
    // 禁用部分按钮
    const floatMenuElm = menu.getFloatElm();
    const menuElms = floatMenuElm.children;
    const clipboardText = await navigator.clipboard.readText();
    if (SelectionTool.getSelectionText().trim().length <= 0) {
        Array.from(menuElms).filter(menuElm => {
            const type = menuElm.getAttribute('data-type') === "paste";
            if (!type) {
                menuElm.classList.add('disabled');
            } else {
                clipboardText ? menuElm.classList.remove('disabled') : menuElm.classList.add('disabled');
            }
        })
    }
}