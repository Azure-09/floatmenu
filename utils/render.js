/**
 * 渲染页面逻辑
 * @param {*} data 
 */
function render(data) {
    const fragment = document.createDocumentFragment();
    if (data) {
        data.forEach(node => {
            if (node.nodeType === 'text') {
                const { textContent, classNames } = node;
                if (classNames.length <= 0) {
                    fragment.appendChild(document.createTextNode(textContent));
                } else {
                    const element = document.createElement('span');
                    element.textContent = textContent;
                    element.classList.add(...classNames);
                    fragment.appendChild(element);
                }
            } else if (node.nodeType === 'img') {
                const img = document.createElement('img');
                img.src = node.src;
                img.style.maxWidth = '100%';
                fragment.appendChild(img);
            }
        })
        return fragment;
    }
}

export default render;