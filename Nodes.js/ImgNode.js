export class ImgNode {
    tagName = 'img';

    constructor(src) {
        this.src = src;
    }

    createImage() {
        const img = document.createElement('img');
        img.src = this.src;
        img.style.maxWidth = '100%';
        return img;
    }
}