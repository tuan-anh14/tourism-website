(function(){
    function initMap(){
        if (typeof maplibregl === 'undefined') return;
        var el = document.getElementById('accMap');
        if (!el) return;
        var lat = parseFloat(el.getAttribute('data-lat') || '21.028511');
        var lng = parseFloat(el.getAttribute('data-lng') || '105.804817');
        var zoom = parseFloat(el.getAttribute('data-zoom') || '14');
        var map = new maplibregl.Map({
            container: el,
            style: {
                version: 8,
                name: 'Minimal Light',
                sources: {
                    light: {
                        type: 'raster',
                        tiles: ['https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap, © CARTO'
                    }
                },
                layers: [{ id: 'base', type: 'raster', source: 'light' }]
            },
            center: [lng, lat],
            zoom: zoom,
            attributionControl: true
        });
        map.scrollZoom.disable();
        map.boxZoom.disable();
        map.dragRotate.disable();
        map.keyboard.disable();
        map.doubleClickZoom.enable();
        map.dragPan.enable();

        function createMarkerElement(){ var m = document.createElement('div'); m.className = 'map-marker active'; return m; }
        var marker = new maplibregl.Marker({ element: createMarkerElement() }).setLngLat([lng, lat]).addTo(map);

        var data = {
            name: el.getAttribute('data-name') || '',
            address: el.getAttribute('data-address') || '',
            image: el.getAttribute('data-image') || ''
        };
        var html = '<div class="map-popup">'
            + '<div class="thumb" style="background-image:url(' + (data.image || '') + ')"></div>'
            + '<div class="info">'
            + '<h4>' + (data.name || '') + '</h4>'
            + '<p>' + (data.address || '') + '</p>'
            + '</div>'
            + '</div>';
        var popup = new maplibregl.Popup({ closeButton: true, offset: 18, maxWidth: '320px' }).setHTML(html);
        marker.setPopup(popup);
        popup.addTo(map);

        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
        map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    }

    function initReviews(){
        var viewport = document.querySelector('.reviews-pro__viewport');
        var track = document.querySelector('.reviews-pro__track');
        var prev = document.querySelector('.reviews-pro__nav.prev');
        var next = document.querySelector('.reviews-pro__nav.next');
        var dotsContainer = document.querySelector('.reviews-pro__dots');
        if (!viewport || !track || !prev || !next || !dotsContainer) return;

        function getCardWidth(){ var card = track.querySelector('.reviews-pro__card'); return card ? (card.offsetWidth + 10) : 0; }
        function getPerView(){ var w = viewport.clientWidth; var cw = getCardWidth(); return cw ? Math.max(1, Math.floor(w / cw)) : 1; }

        var index = 0;
        function getTotalSlides(){ var totalCards = track.children.length; var perView = getPerView(); return Math.max(1, Math.ceil(totalCards / perView)); }
        function update(){ var step = getCardWidth(); var perView = getPerView(); var offset = index * step * perView; var maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth); if (offset > maxOffset) offset = maxOffset; track.style.transform = 'translateX(' + (-offset) + 'px)'; updateDots(); }
        function goTo(i){ var total = getTotalSlides(); index = Math.max(0, Math.min(i, total - 1)); update(); }
        function slide(dir){ goTo(index + dir); }
        function buildDots(){ dotsContainer.innerHTML = ''; var total = getTotalSlides(); for (var i=0;i<total;i++){ var d = document.createElement('button'); d.className = 'reviews-pro__dot'; d.setAttribute('type','button'); (function(idx){ d.addEventListener('click', function(){ goTo(idx); }); })(i); dotsContainer.appendChild(d); } updateDots(); }
        function updateDots(){ var ds = dotsContainer.querySelectorAll('.reviews-pro__dot'); (ds.forEach ? ds.forEach : Array.prototype.forEach).call(ds, function(el, i){ el.classList.toggle('active', i === index); }); }

        prev.addEventListener('click', function(){ slide(-1); });
        next.addEventListener('click', function(){ slide(1); });
        window.addEventListener('resize', function(){ buildDots(); update(); });
        buildDots(); update();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function(){ initMap(); initReviews(); });
    } else { initMap(); initReviews(); }
})();


