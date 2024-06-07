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
            console.log(rect.right, rect.bottom);
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
                        menuItems.length === 5 ? this.hideFloatMenu() : null
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