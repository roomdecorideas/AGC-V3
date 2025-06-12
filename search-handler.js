// Kode ini tidak berubah dari versi terakhir
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-bar-form');
    const searchInput = document.getElementById('search-bar-input');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const keyword = searchInput.value.trim();
            if (keyword) {
                const keywordForUrl = keyword.replace(/\s/g, '-').toLowerCase();
                window.location.href = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;
            }
        });
    }
});
