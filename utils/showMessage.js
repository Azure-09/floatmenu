
let timer = null;
function showMessage(messageText, messageType) {

    // 创建一个新的消息提示元素
    const message = document.createElement('p');
    message.classList.add('message', messageType); // 添加基础样式和特定类型样式

    // 设置消息内容
    message.textContent = messageText;

    if (timer) {
        clearTimeout(timer);
        timer = null;
    }

    // 将消息添加到页面上的容器中
    const container = document.getElementById('messageContainer');
    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(message);
    const show = container.style.display === 'block';
    if (!show) {
        container.style.display = 'block'
    }


    message.addEventListener('animationend', function () {
        timer = setTimeout(() => {
            if (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.style.display = 'none';
        }, 1000)
    })

}

export default showMessage;