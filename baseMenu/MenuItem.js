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
}

export default MenuItem;