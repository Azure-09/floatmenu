import SelectionTool from "../utils/SelectionTool.js";
import MenuItem from "./MenuItem.js";
import getSelectionDirction from "../utils/getSelectionDirction.js";

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
    setMenuElmPosition(menuElm, event) {
        const dirction = getSelectionDirction();
        const rect = SelectionTool.getBoundingClientRect();
        const menuElmWidth = menuElm.offsetWidth / 2;

        // 判断选区的位置
        if (dirction === 'origin') {
            menuElm.style.left = rect.right + "px";
            menuElm.style.top = rect.bottom + "px";
        } else if (dirction === 'backward') {
            menuElm.style.left = event.pageX - menuElmWidth + 'px';
            menuElm.style.top = rect.bottom + window.scrollY + 10 + "px";
        } else if (dirction === 'forword') {
            menuElm.style.left = event.pageX - menuElmWidth + 'px';
            menuElm.style.top = rect.top + window.scrollY - menuElm.offsetHeight - 10 + "px";
        }
    }

    // 设置右键菜单位置
    setMenuElmPositionOnContextmneu(menuElm, event) {
        menuElm.style.left = event.pageX + 'px';
        menuElm.style.top = event.pageY + 'px';
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
        return menuElm;
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