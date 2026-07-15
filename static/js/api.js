// ── Configuration ────────────────────────────────────────────────────────
// ponytail: config precedence → config.js (from .env) > localStorage > fallback
var GAS_API_URL = (typeof CONFIG_GAS_API_URL !== 'undefined' ? CONFIG_GAS_API_URL : null)
    || localStorage.getItem('gas_api_url')
    || '';

// ── API Client ───────────────────────────────────────────────────────────
function callGAS(action, payload) {
    payload = payload || {};
    payload.action = action;
    payload.token = localStorage.getItem('token') || '';

    document.body.classList.add('gas-loading');

    return fetch(GAS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
    })
    .then(function(res) { return res.json(); })
    .catch(function(err) {
        console.error('API Error:', err);
        return { success: false, data: null, message: err.message || 'Network error' };
    })
    .finally(function() {
        document.body.classList.remove('gas-loading');
    });
}

// ── HTMX Integration ─────────────────────────────────────────────────────
// For CRUD pages, use HTMX attributes directly in HTML instead of callGAS:
//
//   <form hx-post="..." hx-vals='{"action":"LOGIN"}' hx-target="#result">
//
// GAS returns JSON → HTMX needs a response swap handler.
// Use htmx:beforeSwap to convert JSON to HTML when needed.
document.addEventListener('htmx:beforeSwap', function(evt) {
    // If server returns JSON and target expects HTML, let HTMX handle raw
    var ct = evt.detail.serverResponse.headers['Content-Type'] || '';
    if (ct.indexOf('application/json') !== -1) {
        // Let HTMX swap the raw JSON text — page JS will parse it
        evt.detail.shouldSwap = true;
        evt.detail.isError = false;
    }
});

// ── Toast Notifications ──────────────────────────────────────────────────
// ponytail: minimal toast system, no library
(function() {
    function initToast() {
        var container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position:fixed;top:16px;right:16px;z-index:99999;display:flex;flex-direction:column;gap:8px;';
        document.body.appendChild(container);
    }
    if (document.body) {
        initToast();
    } else {
        document.addEventListener('DOMContentLoaded', initToast);
    }
})();

function formatIDR(amount) {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
}

function showToast(message, type) {
    type = type || 'info';
    var colors = { info: 'bg-blue-500', success: 'bg-green-500', error: 'bg-red-500', warning: 'bg-yellow-500' };
    var bg = colors[type] || colors.info;

    var el = document.createElement('div');
    el.className = bg + ' text-white px-4 py-3 rounded-lg shadow-lg text-sm flex items-center gap-2';
    el.style.cssText = 'animation:slideIn 0.3s ease;min-width:250px;';
    el.innerHTML = '<span>' + message + '</span>';

    document.getElementById('toast-container').appendChild(el);

    setTimeout(function() {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(function() { el.remove(); }, 300);
    }, 3000);
}

// ── Global Styles (loading indicators + toasts) ───────────────────────────
var style = document.createElement('style');
style.textContent = `
    /* Loading bar for callGAS */
    .gas-loading::after {
        content: '';
        position: fixed;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #60a5fa);
        animation: gas-loading-bar 1s ease infinite;
        z-index: 9999;
    }
    @keyframes gas-loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }

    /* HTMX indicator spinner */
    .htmx-indicator { opacity: 0; transition: opacity 0.3s; }
    .htmx-request .htmx-indicator { opacity: 1; }
    .htmx-request.htmx-indicator { opacity: 1; }

    /* Toast animation */
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
