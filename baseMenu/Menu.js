import SelectionTool from "../utils/SelectionTool.js";
import MenuItem from "./MenuItem.js";

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

    constructor() {

    }

    // 设置菜单位置
    setMenuElmPosition(menuElm) {
        const selection = SelectionTool.getSelection();
        const rangeCount = selection.rangeCount;
        if (rangeCount <= 0) {
            return;
        }

        const { isCollapsed, anchorOffset, focusOffset } = selection;
        const rect = SelectionTool.getBoundingClientRect();
        const menuElmWidth = menuElm.offsetWidth / 2;
        console.log(anchorOffset, focusOffset);
        // 判断选区的位置
        if (isCollapsed) {
            menuElm.style.left = rect.right + "px";
            menuElm.style.top = rect.bottom + "px";
        } else if (anchorOffset > focusOffset) {
            menuElm.style.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
            menuElm.style.top = rect.bottom + window.scrollY + 10 + "px";
        } else if (anchorOffset < focusOffset) {
            console.log('111');
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
                        menuItems.length === 5 ? this.hideFloatMenu() : null
                        menuItem.onClick();
                    },

                });
                floatMenuElm.appendChild(itemElm.createItems());
            });
        }
        return floatMenuElm;
    }

    // 获取菜单
    getFloatElm(floatMenuCls = 'float-menu') {
        return document.querySelector("." + floatMenuCls);
    }


    // 显示菜单
    showFloatMenu(menuItems, config = {}, containElm = document.body) {
        const { floatMenuCls, className } = config;
        this.floatMenuCls = floatMenuCls;
        // 创建菜单
        const menuElm = this.createFloatMenu(menuItems);
        className ? menuElm.classList.add(className) : menuElm.classList.add("show");
        containElm.appendChild(menuElm);
        // 设置菜单位置
        this.setMenuElmPosition(menuElm);

        menuElm.style.visibility = 'hidden';
        // 根据菜单长度是否超出页面来重新设置菜单位置
        const menuOffsetRight = window.innerWidth - menuElm.offsetWidth - menuElm.offsetLeft < 0;
        if (menuOffsetRight) {
            const overWidth = menuElm.offsetWidth - (window.innerWidth - menuElm.offsetLeft);
            menuElm.style.left = (menuElm.offsetLeft - overWidth) + 'px';
            menuElm.style.visibility = 'visible';
        } else {
            menuElm.style.visibility = 'visible';
        }
    }

    // 隐藏菜单
    hideFloatMenu() {
        const floatMenuElm = this.getFloatElm();
        if (floatMenuElm) {
            floatMenuElm.classList.remove("show");
            document.body.removeChild(floatMenuElm);
        }
    }

    // 是否显示菜单
    isMenuShow() {
        const menuElm = this.getFloatElm();
        return menuElm.classList.contains('show');
    }

}


export default Menu;