/**
 * 选区工具：提供获取选区位置、获取选区图形、更新光标位置API
 */
class SelectionTool {
    /**
     * 获取选区文本
     * @returns 
     */
    static getSelectionText() {
        return this.getSelection().toString();
    }

    /**
     * 获取选区图形
     * @returns 
     */
    static getBoundingClientRect() {
        return this.getSelection().getRangeAt(0).getBoundingClientRect();
    }

    /**
     * 更新光标位置
     * @param {*} range 
     */
    static updatePointPosition(range) {
        range.collapse(false); // 将 Range 折叠到其边界的端点
        const selection = this.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    /**
     * 获取selection对象
     * @returns 
     */
    static getSelection() {
        return window.getSelection();
    }

    /**
     * 获取range对象
     */
    static getRangeAt(){
        return this.getSelection().getRangeAt(0);
    }
}

export default SelectionTool;