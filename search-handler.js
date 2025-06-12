document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-bar-form');
    const searchInput = document.getElementById('search-bar-input');

    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const keyword = searchInput.value.trim();
            if (keyword) {
                const keywordForUrl = keyword.replace(/\s/g, '-').toLowerCase();
                // ▼▼▼ PERUBAHAN: Arahkan ke halaman search.html baru ▼▼▼
                window.location.href = `search.html?q=${encodeURIComponent(keywordForUrl)}`;
            }
        });
    }
});
