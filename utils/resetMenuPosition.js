function resetMenuPosition(menuElm) {
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

export default resetMenuPosition;