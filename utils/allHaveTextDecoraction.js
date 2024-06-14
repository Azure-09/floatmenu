function allHaveTextDecoraction(underline, textNodes) {
    // 选区文本是否有text-decoration样式
    let allHaveTextDecoraction;
    if (underline) {
        // 确定所有选中文本节点是否都有下划线
        const allHaveUnderline = textNodes.every(node => {
            return node.hasClassName('underline_font');
        })

        // 确定所有选中文本节点是否都有删除线
        const allHaveLinethrough = textNodes.every(node => {
            return node.hasClassName('linethrough_font');
        })

        allHaveTextDecoraction = allHaveUnderline || allHaveLinethrough;
    }
    return allHaveTextDecoraction;
}

export default allHaveTextDecoraction;