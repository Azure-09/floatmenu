import SelectionTool from "./SelectionTool.js";

/**
 * 比较两个节点的前后顺序
 * @param {*} anchorNode 
 * @param {*} focusNode 
 * @returns 
 */
function compareBoundaryPoints(anchorNode, focusNode) {
    const range = document.createRange();
    range.selectNode(anchorNode);
    const sourceRange = new Range();
    sourceRange.selectNode(focusNode);
    const compare = range.compareBoundaryPoints(Range.START_TO_END, sourceRange);
    return compare;
}

/**
 * 
 * @returns 
 */
function getSelectionDirction() {
    const selection = SelectionTool.getSelection();
    if (!selection.rangeCount) {
        return
    }
    const { isCollapsed, anchorNode, focusNode, anchorOffset, focusOffset } = selection;

    if (isCollapsed) {
        return 'origin';
    }

    if (anchorNode === focusNode) {
        const maxOffset = Math.abs(anchorOffset - focusOffset);

        if (maxOffset <= 46) {
            return 'forword';
        } else {
            return anchorOffset < focusOffset ? 'backward' : 'forword';
        }
    }

    return compareBoundaryPoints(anchorNode, focusNode) < 0 ? 'backward' : 'forword';
}

export default getSelectionDirction;