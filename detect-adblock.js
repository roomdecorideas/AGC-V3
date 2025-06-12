// Kode ini tidak berubah dari versi terakhir
document.addEventListener('DOMContentLoaded', function() {
    window.canRunAds = false;
    function showAdBlockWarning() {
        const overlay = document.getElementById('adblock-overlay');
        if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
        const reloadBtn = document.getElementById('reload-page-btn');
        if (reloadBtn) { reloadBtn.addEventListener('click', function() { window.location.reload(true); }); }
    }
    function checkAdBlock() {
        const adScript = document.createElement('script');
        adScript.src = 'ads.js';
        adScript.onerror = function() { window.canRunAds = false; };
        document.body.appendChild(adScript);
        const baitElement = document.createElement('div');
        baitElement.className = 'adsbox ad-container text-ad banner_ad';
        baitElement.style.cssText = 'position:absolute; left:-9999px; height:1px; width:1px;';
        document.body.appendChild(baitElement);
        setTimeout(function() {
            const adBlockerIsActive = (window.canRunAds === false) || (baitElement.offsetHeight === 0);
            document.body.removeChild(baitElement);
            if (adBlockerIsActive) { console.warn('AdBlocker detected!'); showAdBlockWarning(); } 
            else { console.log('AdBlocker not detected.'); }
        }, 150);
    }
    checkAdBlock();
});
