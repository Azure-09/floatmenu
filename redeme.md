获取的信息：
1. 连续点击同一个事件，那么点击完成后会被清除
2. 点击其他事件，上一次事件完成后它的事件并没有移除，会累加
function handleMenuClick() {
          switch (index) {
            case 'copy': handleCopy();
              break;
            case 'paste': handlePaste();
              break;
            case 'cut': handleCut();
              break;
            case 'translate': handleTranslate();
              break;
            default: console.log('没有这个菜单选项');
          }
          // 隐藏菜单
          hideFloatMenu();
          menuStatus.isMenuVisble = false;

        }