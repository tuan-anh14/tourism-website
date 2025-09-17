(function () {
    var searchInput;
    var categorySelect;
    var pillContainer;
    var cards;

    function normalize(str) {
        return (str || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    function getCardData(card) {
        return {
            title: card.getAttribute('data-title') || '',
            category: card.getAttribute('data-category') || ''
        };
    }

    function applyFilters() {
        var q = normalize(searchInput ? searchInput.value : '');
        var selected = categorySelect ? categorySelect.value : 'all';
        var activePill = pillContainer ? pillContainer.querySelector('.pill.active') : null;
        var pillCategory = activePill ? activePill.getAttribute('data-category') : 'all';

        var category = selected !== 'all' ? selected : pillCategory;

        cards.forEach(function (card) {
            var data = getCardData(card);
            var matchesText = q ? normalize(data.title).includes(q) : true;
            var matchesCat = category === 'all' ? true : data.category === category;
            var visible = matchesText && matchesCat;
            if (visible) {
                card.classList.remove('is-hidden');
            } else {
                card.classList.add('is-hidden');
            }
        });
    }

    function onPillClick(e) {
        var pill = e.target.closest('.pill');
        if (!pill) return;
        pillContainer.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        if (categorySelect) categorySelect.value = 'all';
        applyFilters();
    }

    function init() {
        searchInput = document.getElementById('attraction-search');
        categorySelect = document.getElementById('attraction-category');
        pillContainer = document.querySelector('.attraction-pills');
        cards = Array.prototype.slice.call(document.querySelectorAll('.attraction-card'));

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (categorySelect) categorySelect.addEventListener('change', function () {
            if (pillContainer) pillContainer.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
            applyFilters();
        });
        if (pillContainer) pillContainer.addEventListener('click', onPillClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
