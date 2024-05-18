import selectionTool from "./selectionTool";

export function setMenuElmPosition(left, top) {
    const selection = selectionTool.getSelection();
    const rect = selectionTool.getBoundingClientRect();
    const menuElmWidth = 200 / 2;
    const menuElmHeight = 50;
    const { isCollapsed, anchorOffset, focusOffset } = selection;
    // 判断选区的位置
    if (isCollapsed) {
        left = (rect.right) + "px";
        top = (rect.bottom) + "px";
    } else if (anchorOffset < focusOffset) {
        left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
        top = rect.bottom + window.scrollY + 10 + "px";
    } else if (anchorOffset > focusOffset) {
        left = rect.left + window.scrollX + rect.width / 2 - menuElmWidth + "px";
        top = rect.top + window.scrollY - menuElmHeight - 10 + "px";
    }

    return { left, top };
}