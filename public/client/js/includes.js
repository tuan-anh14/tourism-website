(function () {
    function inject(selector, url) {
        var container = document.querySelector(selector);
        if (!container) return Promise.resolve();
        return fetch(url, { cache: 'no-cache' })
            .then(function (res) { return res.text(); })
            .then(function (html) {
                container.innerHTML = html;
            })
            .catch(function (e) { console.error('Include failed for', url, e); });
    }

    function loadPartials() {
        return Promise.all([
            inject('[data-include="header"]', 'partials/header.html'),
            inject('[data-include="footer"]', 'partials/footer.html')
        ]).then(function () {
            document.dispatchEvent(new CustomEvent('partials:loaded'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPartials);
    } else {
        loadPartials();
    }
})();
