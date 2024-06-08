import { splitSelectedText } from "./splitSeletedText.js";

function getClassName() {
    const textNodes = splitSelectedText();
    const classList = new Set();
    textNodes.forEach(node => {
        const { classNames } = node;
        classNames.forEach(className => {
            classList.add(className);
        })
    });

    const classListStatus = {
        weight: false,
        italic: false,
        underline: false,
        lineThrough: false,
        color: false,
        highlightShow: false
    }

    classList.forEach(className => {
        switch (className) {
            case 'bold_font': classListStatus.weight = true;
                break;
            case 'italic_font': classListStatus.italic = true;
                break;
            case 'underline_font': classListStatus.underline = true;
                break;
            case 'linethrough_font': classListStatus.lineThrough = true;
                break;
            case 'color_font': classListStatus.color = true;
                break;
            case 'bg_font': classListStatus.highlightShow = true;
                break;
            default: console.log('Not the className');
        }
    })

    return classListStatus;
}

export default getClassName;