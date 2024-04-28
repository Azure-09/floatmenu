获取的信息：

1.  连续点击同一个事件，那么点击完成后会被清除
2.  点击其他事件，上一次事件完成后它的事件并没有移除，会累加
    function handleMenuClick() {
    switch (index) {
    case 'copy': handleCopy();
    break;
    case 'paste': handlePaste();
    break;
    case 'cut': handleCut();
    break;
    case 'translate': handleTranslate();
    break;
    default: console.log('没有这个菜单选项');
    }
    // 隐藏菜单
    hideFloatMenu();
    menuStatus.isMenuVisble = false;

            }

function handleMenuClick(event) {
const item = event.currentTarget;
const index = item.getAttribute('data-type');
switch (index) {
case 'copy': handleCopy();
break;
case 'paste': handlePaste();
break;
case 'cut': handleCut();
break;
case 'translate': handleTranslate();
break;
default: console.log('没有这个菜单选项');
}
// 隐藏菜单
hideFloatMenu();
}

// menuElm.querySelectorAll('.menu-item').forEach(item => {
// if (!item.dataset.eventAttached) {
// item.addEventListener('click', handleMenuClick);
// item.dataset.eventAttached = true;
// }
// });

// 移除事件
if (!isMenuShow()) {
// floatMenuElm.querySelectorAll('.menu-item[data-eventAttached="true"]').forEach(item => {
// item.removeEventListener('click', handleMenuClick);
// item.removeAttribute('data-eventAttached');
// })
}

localStorage 的大小限制如下:

- 所有 value 的总大小限制为 5MB+。
- 单个 key 达到上限，无法继续设置其他 key。
- 业界主流是 5 MB，但每个浏览器各自又有些不同。Chrome 78 版限制 5MB，而 Safari 13.0.2 限制 2.5MB。
