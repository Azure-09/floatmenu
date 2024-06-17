class ImgNode {
    nodeType = 'img';

    constructor(src) {
        this.src = src;
    }

    renderImage() {
        const img = document.createElement('img');
        img.src = this.src;
        img.style.maxWidth = '100%';
        return img;
    }

    serialize() {
        return { nodeType: "img", src: this.src };
    }
}

export default ImgNode;