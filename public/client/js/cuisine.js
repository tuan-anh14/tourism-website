(function () {
    var searchInput; var areaSelect; var typeSelect; var formSelect; var pillContainer; var cards;

    function normalize(str) { return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); }

    function getCardData(card) {
        return {
            title: card.getAttribute('data-title') || '',
            area: card.getAttribute('data-area') || 'center',
            dtype: card.getAttribute('data-type') || 'dish',
            form: card.getAttribute('data-form') || 'street',
            rating: Number(card.getAttribute('data-rating') || '0')
        };
    }

    function applyFilters() {
        var q = normalize(searchInput ? searchInput.value : '');
        var area = areaSelect ? areaSelect.value : 'all';
        var dtype = typeSelect ? typeSelect.value : 'all';
        var form = formSelect ? formSelect.value : 'all';
        var activePill = pillContainer ? pillContainer.querySelector('.pill.active') : null;
        var pill = activePill ? activePill.getAttribute('data-type') : 'all';
        if (dtype === 'all' && pill !== 'all') dtype = pill;

        cards.forEach(function (card) {
            var d = getCardData(card);
            var matchesText = q ? normalize(d.title).includes(q) : true;
            var matchesArea = area === 'all' ? true : d.area === area;
            var matchesType = dtype === 'all' ? true : d.dtype === dtype;
            var matchesForm = form === 'all' ? true : d.form === form;
            var visible = matchesText && matchesArea && matchesType && matchesForm;
            if (visible) card.classList.remove('is-hidden'); else card.classList.add('is-hidden');
        });
    }

    function onPillClick(e) {
        var p = e.target.closest('.pill'); if (!p) return;
        pillContainer.querySelectorAll('.pill').forEach(function (x) { x.classList.remove('active'); });
        p.classList.add('active');
        if (typeSelect) typeSelect.value = 'all';
        applyFilters();
    }

    function init() {
        searchInput = document.getElementById('cui-search');
        areaSelect = document.getElementById('cui-area');
        typeSelect = document.getElementById('cui-type');
        formSelect = document.getElementById('cui-form');
        pillContainer = document.querySelector('.cuisine-pills');
        cards = Array.prototype.slice.call(document.querySelectorAll('.cuisine-card'));

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (areaSelect) areaSelect.addEventListener('change', applyFilters);
        if (typeSelect) typeSelect.addEventListener('change', function(){ if (pillContainer) pillContainer.querySelectorAll('.pill').forEach(function (x) { x.classList.remove('active'); }); applyFilters(); });
        if (formSelect) formSelect.addEventListener('change', applyFilters);
        if (pillContainer) pillContainer.addEventListener('click', onPillClick);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
