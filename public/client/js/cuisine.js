(function () {
    var searchInput; var areaSelect; var formSelect; var cards;

    function normalize(str) { return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); }

    function getCardData(card) {
        return {
            title: card.getAttribute('data-title') || '',
            area: card.getAttribute('data-area') || 'center',
            form: card.getAttribute('data-form') || 'street',
            rating: Number(card.getAttribute('data-rating') || '0')
        };
    }

    function applyFilters() {
        var q = normalize(searchInput ? searchInput.value : '');
        var area = areaSelect ? areaSelect.value : 'all';
        var form = formSelect ? formSelect.value : 'all';

        cards.forEach(function (card) {
            var d = getCardData(card);
            var matchesText = q ? normalize(d.title).includes(q) : true;
            var matchesArea = area === 'all' ? true : d.area === area;
            var matchesForm = form === 'all' ? true : d.form === form;
            var visible = matchesText && matchesArea && matchesForm;
            if (visible) card.classList.remove('is-hidden'); else card.classList.add('is-hidden');
        });
    }

    function init() {
        searchInput = document.getElementById('cui-search');
        areaSelect = document.getElementById('cui-area');
        formSelect = document.getElementById('cui-form');
        cards = Array.prototype.slice.call(document.querySelectorAll('.cuisine-card'));

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (areaSelect) areaSelect.addEventListener('change', applyFilters);
        if (formSelect) formSelect.addEventListener('change', applyFilters);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
