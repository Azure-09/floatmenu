const selectionTool = {
    /**
     * 获取selection
     */
    getSelection() {
        return window.getSelection();
    },
    /**
     * 获取选取文本
     */
    getSelectionText() {
        return this.getSelection().toString();
    },
    /**
     * 获取选取图形
     */
    getBoundingClientRect() {
        return this.getSelection().getRangeAt(0).getBoundingClientRect();
    },
    /**
     * 更新光标位置
     * @param {*} range 
     * @param {*} selection 
     */
    updatePointPosition(range, selection) {
        range.collapse(false); // 将 Range 折叠到其边界的端点
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export default selectionTool;