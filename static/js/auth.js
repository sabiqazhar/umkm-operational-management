// ── Auth Middleware ───────────────────────────────────────────────────────
// ponytail: sync check on every page, no framework
(function() {
    var path = window.location.pathname;
    var isLoginPage = path.indexOf('login.html') !== -1 || path === '/' || path.endsWith('/');
    var token = localStorage.getItem('token');

    // Already logged in on login page → redirect to dashboard
    if (isLoginPage && token) {
        window.location.href = 'index.html';
        return;
    }

    // Not logged in on protected page → redirect to login
    if (!isLoginPage && !token) {
        window.location.href = 'login.html';
        return;
    }
})();
