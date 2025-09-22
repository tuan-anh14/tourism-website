(function(){
    function onShare(){
        try {
            var data = {
                title: document.title,
                text: document.querySelector('.attraction-detail.hero .title')?.textContent || 'Chia sẻ điểm tham quan',
                url: window.location.href
            };
            if (navigator.share) {
                navigator.share(data).catch(function(){});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết');
            }
        } catch(e) {}
    }

    function init(){
        var shareBtn = document.querySelector('.btn-share');
        if (shareBtn) shareBtn.addEventListener('click', onShare);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();


