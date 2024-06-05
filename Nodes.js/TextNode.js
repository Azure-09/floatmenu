export class TextNode {
    nodeType = 'text';

    constructor(textContent, classNames = []) {
        this.textContent = textContent;
        this.classNames = classNames;
    }

    // 是否存在某个类名
    hasClassName(className) {
        return this.classNames.includes(className);
    }

    //添加类名
    addClassName(className) {
        if (!this.hasClassName(className)) {
            this.classNames.push(className);
        }
    }

    // 移除类名
    removeClassName(className) {
        const index = this.classNames.indexOf(className);
        if (index !== -1) {
            this.classNames.splice(index, 1);
        }
    }

    // 生成span元素
    renderElement() {
        const element = document.createElement('span');
        element.textContent = this.textContent;
        this.classNames.forEach(className => element.classList.add(className));
        return element;
    }

    serialize() {
        return { nodeType: 'text', textContent: this.textContent, classNames: this.classNames };
    }
}