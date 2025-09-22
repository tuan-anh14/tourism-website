(function () {
    var searchInput;
    var categorySelect;
    var pillContainer;
    var cards;
    
    // Hero search elements
    var heroSearchInput;
    var heroSearchForm;
    var searchSuggestions;
    var searchClearBtn;
    var popularSuggestions;
    var popularIndex = 0;
    var popularTimerId;
    
    // Search data
    var attractionsData = [
        { title: "Hoàng thành Thăng Long", category: "historic", icon: "fa-landmark" },
        { title: "Văn Miếu - Quốc Tử Giám", category: "historic", icon: "fa-university" },
        { title: "Bảo tàng Dân tộc học Việt Nam", category: "museum", icon: "fa-museum" },
        { title: "Phố cổ Hà Nội", category: "oldquarter", icon: "fa-home" },
        { title: "Làng gốm Bát Tràng", category: "craft", icon: "fa-palette" },
        { title: "Công viên Thống Nhất", category: "park", icon: "fa-tree" },
        { title: "Lễ hội Gióng", category: "festival", icon: "fa-calendar" },
        { title: "Hồ Hoàn Kiếm", category: "historic", icon: "fa-water" },
        { title: "Chùa Một Cột", category: "historic", icon: "fa-temple-buddhist" },
        { title: "Nhà hát Lớn Hà Nội", category: "historic", icon: "fa-theater-masks" }
    ];
    
    var categoryLabels = {
        historic: "Di tích lịch sử",
        museum: "Bảo tàng", 
        oldquarter: "Phố cổ",
        craft: "Làng nghề",
        park: "Khu vui chơi",
        festival: "Lễ hội"
    };

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

    // Hero search functions
    function renderNoResults() {
        if (!searchSuggestions) return;
        searchSuggestions.innerHTML = '<div class="no-results">Không có dữ liệu</div>';
        searchSuggestions.classList.add('show');
    }

    function showSuggestions(query) {
        if (!searchSuggestions) return;
        
        if (!query || query.length < 2) {
            hideSuggestions();
            return;
        }
        
        var normalizedQuery = normalize(query);
        var matches = attractionsData.filter(function(item) {
            return normalize(item.title).includes(normalizedQuery);
        }).slice(0, 5); // Limit to 5 suggestions
        
        if (matches.length === 0) {
            renderNoResults();
            return;
        }
        
        var html = matches.map(function(item) {
            return '<div class="suggestion-item" data-title="' + item.title + '" data-category="' + item.category + '">' +
                   '<i class="fa ' + item.icon + ' suggestion-icon"></i>' +
                   '<span class="suggestion-text">' + item.title + '</span>' +
                   '<span class="suggestion-category">' + categoryLabels[item.category] + '</span>' +
                   '</div>';
        }).join('');
        
        searchSuggestions.innerHTML = html;
        searchSuggestions.classList.add('show');
        
        // Add click handlers to suggestions
        var suggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(function(item) {
            item.addEventListener('click', function() {
                var title = this.getAttribute('data-title');
                var category = this.getAttribute('data-category');
                selectSuggestion(title, category);
            });
        });
    }
    
    function hideSuggestions() {
        if (searchSuggestions) {
            searchSuggestions.classList.remove('show');
        }
    }
    
    function selectSuggestion(title, category) {
        if (heroSearchInput) {
            heroSearchInput.value = title;
        }
        hideSuggestions();
        
        // Update filters to show this attraction
        if (searchInput) searchInput.value = title;
        if (categorySelect) categorySelect.value = category;
        
        // Update pills
        if (pillContainer) {
            pillContainer.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
            var targetPill = pillContainer.querySelector('[data-category="' + category + '"]');
            if (targetPill) targetPill.classList.add('active');
        }
        
        applyFilters();
        
        // Scroll to results
        var resultsSection = document.querySelector('.attraction-page');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function onHeroSearchInput(e) {
        var query = e.target.value;
        showSuggestions(query);
        
        // Show/hide clear button
        if (searchClearBtn) {
            if (query.length > 0) {
                searchClearBtn.classList.add('show');
            } else {
                searchClearBtn.classList.remove('show');
            }
        }
    }
    
    function onHeroSearchSubmit(e) {
        e.preventDefault();
        var query = heroSearchInput ? heroSearchInput.value.trim() : '';
        
        if (query.length < 2) return;
        
        // Find exact match first
        var exactMatch = attractionsData.find(function(item) {
            return normalize(item.title) === normalize(query);
        });
        
        if (exactMatch) {
            selectSuggestion(exactMatch.title, exactMatch.category);
        } else {
            // Apply general search
            if (searchInput) searchInput.value = query;
            applyFilters();
            
            // Scroll to results
            var resultsSection = document.querySelector('.attraction-page');
            if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        hideSuggestions();
    }
    
    function onHeroSearchKeyPress(e) {
        if (e.key === 'Enter') {
            onHeroSearchSubmit(e);
        }
    }
    
    function onSearchClear() {
        if (heroSearchInput) heroSearchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.remove('show');
        hideSuggestions();
    }
    
    function onPopularSuggestionClick(e) {
        e.preventDefault();
        var category = e.target.getAttribute('data-category');
        if (!category) return;
        
        // Update category filter
        if (categorySelect) categorySelect.value = category;
        
        // Update pills
        if (pillContainer) {
            pillContainer.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
            var targetPill = pillContainer.querySelector('[data-category="' + category + '"]');
            if (targetPill) targetPill.classList.add('active');
        }
        
        // Clear search
        if (searchInput) searchInput.value = '';
        if (heroSearchInput) heroSearchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.remove('show');
        
        applyFilters();
        hideSuggestions();
        
        // Scroll to results
        var resultsSection = document.querySelector('.attraction-page');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    function onDocumentClick(e) {
        // Hide suggestions when clicking outside
        if (searchSuggestions && !searchSuggestions.contains(e.target) && 
            heroSearchInput && !heroSearchInput.contains(e.target)) {
            hideSuggestions();
        }
    }

    function rotatePopularSuggestion() {
        if (!popularSuggestions || popularSuggestions.length === 0) return;
        popularSuggestions.forEach(function(btn, i) {
            if (i === popularIndex) btn.classList.add('is-active');
            else btn.classList.remove('is-active');
        });
        popularIndex = (popularIndex + 1) % popularSuggestions.length;
    }

    function init() {
        // Original filter elements (searchInput removed from UI, but keep support if added later)
        searchInput = document.getElementById('attraction-search');
        categorySelect = document.getElementById('attraction-category');
        pillContainer = document.querySelector('.attraction-pills');
        cards = Array.prototype.slice.call(document.querySelectorAll('.attraction-card'));

        // Hero search elements
        heroSearchInput = document.getElementById('hero-search-input');
        heroSearchForm = document.querySelector('.hero-search-form');
        searchSuggestions = document.getElementById('search-suggestions');
        searchClearBtn = document.querySelector('.search-clear');
        popularSuggestions = document.querySelectorAll('.popular-suggestion');

        // Original event listeners
        if (searchInput) searchInput.addEventListener('input', applyFilters);
        if (categorySelect) categorySelect.addEventListener('change', function () {
            if (pillContainer) pillContainer.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
            applyFilters();
        });
        if (pillContainer) pillContainer.addEventListener('click', onPillClick);
        
        // Hero search event listeners
        if (heroSearchInput) {
            heroSearchInput.addEventListener('input', onHeroSearchInput);
            heroSearchInput.addEventListener('keypress', onHeroSearchKeyPress);
            heroSearchInput.addEventListener('focus', function() {
                if (this.value.length >= 2) {
                    showSuggestions(this.value);
                }
            });
        }
        
        if (heroSearchForm) {
            heroSearchForm.addEventListener('submit', onHeroSearchSubmit);
        }
        
        if (searchClearBtn) {
            searchClearBtn.addEventListener('click', onSearchClear);
        }
        
        if (popularSuggestions) {
            popularSuggestions.forEach(function(button) {
                button.addEventListener('click', onPopularSuggestionClick);
            });
            // start rotation, show one at a time
            rotatePopularSuggestion();
            if (popularTimerId) clearInterval(popularTimerId);
            popularTimerId = setInterval(rotatePopularSuggestion, 2000);
        }
        
        // Global click listener for hiding suggestions
        document.addEventListener('click', onDocumentClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
