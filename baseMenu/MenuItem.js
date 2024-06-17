/**
 * 生成菜单选项
 */
class MenuItem {

    constructor({ menuItem, onClick, }) {
        const { type, text } = menuItem;
        this.type = type;
        this.text = text;
        this.onClick = onClick;
    }

    createItems() {
        const itemElm = document.createElement("div");
        itemElm.style.whiteSpace = 'nowrap';
        itemElm.appendChild(document.createTextNode(this.text));
        itemElm.setAttribute('data-type', this.type);
        itemElm.classList.add("menu-item");
        itemElm.addEventListener('click', this.onClick);
        return itemElm;
    }

    // 禁用部分按钮
    static disableButtons(menuElms, clipboardText) {
        Array.from(menuElms).forEach(menuElm => {
            const activeButton = menuElm.getAttribute('data-type') === "paste" || menuElm.getAttribute('data-type') === "addImg";
            if (!activeButton) {
                menuElm.classList.add('disabled');
            } else {
                // 根据剪切板是否有内容决定是否禁用按钮
                clipboardText ? menuElm.classList.remove('disabled') : menuElm.classList.add('disabled');
            }
        })
    }

    // 解除部分按钮
    static enableButtons(menuElms, clipboardText) {
        Array.from(menuElms).forEach(menuElm => {
            menuElm.classList.remove('disabled');
            const pasteButton = menuElm.getAttribute('data-type') === 'paste';
            if (pasteButton) {
                clipboardText ? menuElm.classList.remove('disabled') : menuElm.classList.add('disabled');
            }
        })
    }
}

export default MenuItem;