const menuItems = [
  { type: "copy", text: "复制" },
  { type: "paste", text: "粘贴" },
  { type: "cut", text: "剪切" },
  { type: "translate", text: "翻译" },
];
const floatMenuCls = "float-menu";

const editorElm = document.querySelector(".editor");

// 存储选区文本
let copyContent = '';

// 存储菜单状态：鼠标按下有内容、点击时显示菜单
const menuStatus = {
  hasSelectionContentOnMousedown: false,
  showFloatMenuOnClick: false,
  isDragOnDragStart: false,
  shouldShowMenuOnDragend: false,
};

// 获取选区文本
function getSelectionText() {
  const selection = window.getSelection();
  return selection.toString();
}

// 获取菜单元素
function getFloatElm() {
  return document.querySelector("." + floatMenuCls);
}

// 设置菜单位置
function setMenuElmPosition(menuElm, x, y) {
  const selection = window.getSelection();
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  const menuElmWidth = menuElm.offsetWidth / 2;
  // 判断选区的位置
  if (selection.isCollapsed) {
    menuElm.style.left = (rect.right || x) + "px";
    menuElm.style.top = (rect.bottom || y) + "px";
  } else {
    menuElm.style.left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
    menuElm.style.top = rect.bottom + window.scrollY + 10 + "px";
  }
}


// 显示菜单
function showFloatMenu(x, y) {
  // 创建菜单
  function createFloatMenu() {
    let floatMenuElm = getFloatElm();
    if (!floatMenuElm) {
      floatMenuElm = document.createElement("div");
      floatMenuElm.classList.add(floatMenuCls);
      menuItems.forEach((menuItem, index) => {
        const itemElm = document.createElement("div");
        itemElm.appendChild(document.createTextNode(menuItem.text));
        itemElm.setAttribute('data-index', menuItems[index].type);
        itemElm.classList.add("menu-item");
        floatMenuElm.appendChild(itemElm);
      });
      document.body.appendChild(floatMenuElm);
    }
    return floatMenuElm;
  }
  const menuElm = createFloatMenu();
  menuElm.classList.add("show");

  // 设置菜单位置
  setMenuElmPosition(menuElm, x, y);

  // 注册菜单点击事件
  menuElm.querySelectorAll('.menu-item').forEach(item => {
    if (!item.dataset.eventAttached) {
      item.addEventListener('click', handleMenuClick);
      item.dataset.eventAttached = true;
    }
  });
}

// 菜单点击事件回调函数
function handleMenuClick(event) {
  const item = event.currentTarget;
  const index = item.getAttribute('data-index');
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

// 隐藏菜单
function hideFloatMenu() {
  const floatMenuElm = getFloatElm();
  if (floatMenuElm) {
    floatMenuElm.classList.remove("show");
    // 移除事件
    if (!isMenuShow()) {
      floatMenuElm.querySelectorAll('.menu-item[data-eventAttached="true"]').forEach(item => {
        item.removeEventListener('click', handleMenuClick);
        item.removeAttribute('data-eventAttached');
      })
    }
  }
}

// 是否显示菜单
function isMenuShow() {
  const menuElm = getFloatElm();
  return menuElm.classList.contains('show');
}

/**
 * 如果以下事件只在editorElm上监听，会发现点击输入框之外是无法取消菜单显示的，因为没有监听那里的事件。
 * 改为window上监听就没有这个问题
 */

// 鼠标按下事件--->改变选区状态
editorElm.addEventListener("mousedown", function handleMousedown(event) {
  setTimeout(() => {
    menuStatus.hasSelectionContentOnMousedown = getSelectionText().length > 0;
  }, 0);
});

// 鼠标弹起事件--->改变显示菜单的状态
editorElm.addEventListener("mouseup", function handleMouseup(event) {
  const { hasSelectionContentOnMousedown } = menuStatus;
  const selectionText = getSelectionText();
  menuStatus.showFloatMenuOnClick = !hasSelectionContentOnMousedown && selectionText.length !== 0;
  menuStatus.isDragOnDragStart = false;
  copyContent = selectionText;
  localStorage.setItem('content', copyContent);
});


// 点击事件--->显示菜单
editorElm.addEventListener("click", function handleClick(event) {
  const { showFloatMenuOnClick } = menuStatus;
  if (showFloatMenuOnClick) {
    showFloatMenu(event.pageX, event.pageY);
  } else {
    hideFloatMenu();
  }
});


// 监听文本变化事件(在当前Document的Selection改变时触发，此事件不可取消，也不会冒泡)
// 解决 拖选开始没有取消显示菜单，也可以用来根据有无选区隐藏菜单
document.addEventListener("selectionchange", function handleSelectionChange(event) {
  const selectionText = getSelectionText();
  if (!selectionText) {
    hideFloatMenu();
  }
})

// 解决 拖拽选中的内容时菜单不消失
// 期望：拖拽选中的内容时菜单消失，拖拽完成后菜单重新显示
editorElm.addEventListener('dragstart', function handleDragstart(event) {
  if (isMenuShow()) {
    menuStatus.shouldShowMenuOnDragend = true;
    hideFloatMenu();
  } else {
    menuStatus.shouldShowMenuOnDragend = false;
  }
})

editorElm.addEventListener('dragend', function handleDragend(event) {
  const { shouldShowMenuOnDragend } = menuStatus;
  if (shouldShowMenuOnDragend) {
    showFloatMenu(event.pageX, event.pageY);
  } else {
    hideFloatMenu();
  }
})

// 右键显示菜单
editorElm.addEventListener('contextmenu', function handleContextmenu(event) {
  event.preventDefault();
  showFloatMenu(event.pageX, event.pageY);
})

/**
 * 复制功能
 */
function handleCopy() {
  // 将内容写入剪切板
  navigator.clipboard.writeText(copyContent);
  console.log('复制');
}

/**
 * 粘贴功能
 */
async function handlePaste() {
  // 获取剪切板的内容
  const pasteContent = await navigator.clipboard.readText();
  // 获取选区内容
  const selectionText = getSelectionText();
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  // 如果有选区
  if (selectionText.trim().length > 0) {
    // 清除选区的内容
    range.deleteContents();
  }
  // 创建虚拟节点
  const textNode = document.createTextNode(pasteContent);
  // 将文本插入到光标位置
  range.insertNode(textNode);
  // 保持光标位置在插入文本之后
  range.collapse(false); // 将 Range 折叠到其边界的端点
  selection.removeAllRanges();
  selection.addRange(range);
  console.log('粘贴');

}

/**
 * 剪切功能
 */
function handleCut() {
  // 获取选区文本
  const selectionText = getSelectionText();
  const selection = window.getSelection();
  // 将选区文本写入剪切板
  navigator.clipboard.writeText(selectionText);
  // 判断是否有选区内容
  if (selectionText.trim().length > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    // 重新设置选区
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.log('没有选区内容');
  }
  console.log('剪切');

}


/**
 * 翻译功能
 */
function handleTranslate() {
  const translateArea = document.querySelector('.translateArea');
  // 获取剪切板的内容
  const pasteContent = localStorage.getItem('content');
  // 设置默认翻译的语言
  translate.language.setDefaultTo('english');
  // 隐藏语言下拉菜单
  translate.selectLanguageTag.show = false;
  // 翻译选区内容
  if (pasteContent) {
    translate.request.translateText(pasteContent, function (data) {
      translateArea.textContent = data.text[0];
      console.log(data);
    })
  } else {
    console.log('不存在内容');
  }
  console.log('翻译');
}