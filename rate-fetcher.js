/**
 * 汇率拉取模块
 * 通过 api.nudgenow.xyz/rate 获取实时汇率
 * Worker 内部请求外部汇率源，完全绕过 GFW
 */
const RateFetcher = (() => {
    const RATE_URL = 'https://osapi.nudgenow.xyz/rate';
    let _cached = null; // 会话内缓存，避免重复请求

    async function fetch_rate() {
        if (_cached) return _cached;
        try {
            const res  = await fetch(RATE_URL);
            const data = await res.json();
            if (data && data.rate && !isNaN(data.rate)) {
                _cached = { rate: parseFloat(data.rate), date: data.date || '' };
                return _cached;
            }
        } catch (e) {
            // 网络失败，返回 null，调用方使用默认值 7.25
        }
        return null;
    }

    return { fetch_rate };
})();
