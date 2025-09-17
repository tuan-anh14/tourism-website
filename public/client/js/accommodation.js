(function () {
    var searchInput; var typeSelect; var priceSelect; var areaSelect; var pillContainer; var cards;

    function normalize(str) { return (str || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ''); }

    function parsePriceBucket(val) {
        // buckets: all, lt1m, 1to2m, 2to3m, gt3m (VND/night)
        return val || 'all';
    }

    function matchesPrice(bucket, price) {
        if (!bucket || bucket === 'all') return true;
        if (bucket === 'lt1m') return price < 1000000;
        if (bucket === '1to2m') return price >= 1000000 && price < 2000000;
        if (bucket === '2to3m') return price >= 2000000 && price < 3000000;
        if (bucket === 'gt3m') return price >= 3000000;
        return true;
    }

    function getCardData(card) {
        return {
            title: card.getAttribute('data-title') || '',
            type: card.getAttribute('data-type') || 'hotel',
            area: card.getAttribute('data-area') || 'center',
            price: Number(card.getAttribute('data-price') || '0'),
            amenities: (card.getAttribute('data-amenities') || '').split(',')
        };
    }

    function applyFilters() {
        var q = normalize(searchInput ? searchInput.value : '');
        var selectedType = typeSelect ? typeSelect.value : 'all';
        var priceBucket = parsePriceBucket(priceSelect ? priceSelect.value : 'all');
        var area = areaSelect ? areaSelect.value : 'all';
        var activePill = pillContainer ? pillContainer.querySelector('.pill.active') : null;
        var pillType = activePill ? activePill.getAttribute('data-type') : 'all';
        var type = selectedType !== 'all' ? selectedType : pillType;

        cards.forEach(function (card) {
            var d = getCardData(card);
            var matchesText = q ? normalize(d.title).includes(q) : true;
            var matchesType = type === 'all' ? true : d.type === type;
            var matchesArea = area === 'all' ? true : d.area === area;
            var matchesP = matchesPrice(priceBucket, d.price);
            var visible = matchesText && matchesType && matchesArea && matchesP;
            if (visible) card.classList.remove('is-hidden'); else card.classList.add('is-hidden');
        });
    }

    function onPillClick(e) {
        var pill = e.target.closest('.pill'); if (!pill) return;
        pillContainer.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        if (typeSelect) typeSelect.value = 'all';
        applyFilters();
    }

    function init() {
        searchInput = document.getElementById('acc-search');
        typeSelect = document.getElementById('acc-type');
        priceSelect = document.getElementById('acc-price');
        areaSelect = document.getElementById('acc-area');
        pillContainer = document.querySelector('.accommodation-pills');
        cards = Array.prototype.slice.call(document.querySelectorAll('.accommodation-card'));

        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (typeSelect) typeSelect.addEventListener('change', function(){ if (pillContainer) pillContainer.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); }); applyFilters(); });
        if (priceSelect) priceSelect.addEventListener('change', applyFilters);
        if (areaSelect) areaSelect.addEventListener('change', applyFilters);
        if (pillContainer) pillContainer.addEventListener('click', onPillClick);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
