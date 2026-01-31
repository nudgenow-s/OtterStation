const AlertSystem = {
    check(itemName, remaining, total) {
        if (remaining / total <= 0.2) {
            return `<div style="color:red; font-weight:bold; border:1px solid red; padding:10px; margin-top:10px;">
                ⚠️ 预警：${itemName} 仅剩 ${remaining} 件，请及时补货！
            </div>`;
        }
        return "";
    }
};
