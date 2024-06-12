
// 构建类名与菜单项索引的映射
const classNameToIndexMap = {
    'bold_font': 0,
    'italic_font': 1,
    'underline_font': 2,
    'linethrough_font': 3,
    'color_font': 4,
    'bg_font': 5,
};

/**
 * 收集类名
 * @returns 
 */
function addStyleClassName() {
    const textNodes = window.textNodes;

    // 将HTML插入到临时div中并收集所有类名
    let classList = new Set();
    textNodes.forEach(node => {
        node.classNames.forEach(className => classList.add(className));
    })
    return classList;
}


// 根据classList中的类名高亮对应菜单项
function addButtonBgcOnSelctionChange(floatMenuElm) {
    const classList = addStyleClassName();

    // 预先获取navFloatMenu的所有子元素
    const menuItems = Array.from(floatMenuElm.children);

    // 清除导航菜单样式
    menuItems.forEach(menuElm => menuElm.classList.remove('addBgc'));

    if (classList.size) {
        classList.forEach(className => {
            if (classNameToIndexMap.hasOwnProperty(className)) {
                const index = classNameToIndexMap[className];
                menuItems[index].classList.add('addBgc');
            }
        });
    }

}

export default addButtonBgcOnSelctionChange;