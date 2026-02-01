/**
 * Stellarock Tech - 统一版权页脚组件
 * 逻辑：自动检测页面结构并注入极简版权声明
 */
(function() {
    // 1. 创建 Footer 元素
    const footer = document.createElement('footer');
    footer.className = 'stellarock-footer';

    // 2. 设置内容 (极简版)
    footer.innerHTML = `
        <div class="footer-brand">STELLAROCK TECH</div>
        <div>Copyright © 2026 辰石科技</div>
        <div class="footer-version">v1.0.4</div>
    `;

    // 3. 寻找注入点
    // 优先放在 app-container 后面，如果没有则放在 body 最后
    const container = document.querySelector('.app-container') || document.body;
    
    if (container === document.body) {
        document.body.appendChild(footer);
    } else {
        container.parentNode.insertBefore(footer, container.nextSibling);
    }
})();
