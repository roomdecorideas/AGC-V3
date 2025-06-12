document.addEventListener('DOMContentLoaded', function() {
    const resultsContainer = document.getElementById('search-results-container');
    const loader = document.getElementById('loader');
    const searchTitle = document.getElementById('search-title');
    const searchSubtitle = document.getElementById('search-subtitle');

    let allKeywords = [];
    let currentIndex = 0;
    const batchSize = 15;
    let isLoading = false;

    // --- Fungsi Bantuan ---
    function capitalizeEachWord(str) { if (!str) return ''; return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); }
    function generateSeoTitle(baseKeyword) { const hookWords = ['Best', 'Amazing', 'Cool', 'Inspiring', 'Creative', 'Awesome', 'Stunning', 'Beautiful', 'Unique', 'Ideas', 'Inspiration', 'Designs']; const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)]; const randomNumber = Math.floor(Math.random() * (200 - 55 + 1)) + 55; const capitalizedKeyword = capitalizeEachWord(baseKeyword); return `${randomNumber} ${randomHook} ${capitalizedKeyword}`; }

    // --- Fungsi Utama ---
    function loadNextBatch() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';
        const batch = allKeywords.slice(currentIndex, currentIndex + batchSize);
        setTimeout(() => {
            batch.forEach(keyword => {
                if (!keyword) return;
                const keywordForUrl = keyword.trim().replace(/\s/g, '-').toLowerCase();
                const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`; 
                const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(keyword)}&w=500&h=750&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
                const newTitle = generateSeoTitle(keyword);
                const cardHTML = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newTitle}" loading="lazy"><div class="content-card-body"><h3>${newTitle}</h3></div></a></article>`;
                resultsContainer.innerHTML += cardHTML;
            });
            currentIndex += batch.length;
            loader.style.display = 'none';
            isLoading = false;
            if (currentIndex >= allKeywords.length) { window.removeEventListener('scroll', handleInfiniteScroll); loader.style.display = 'none'; }
        }, 500);
    }

    function handleInfiniteScroll() { if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight - 100) { loadNextBatch(); } }

    async function initializeSearch() {
        const params = new URLSearchParams(window.location.search);
        const query = (params.get('q') || '').replace(/-/g, ' ');
        if (!query) {
            searchTitle.textContent = 'No Search Query';
            searchSubtitle.textContent = 'Please use the search bar to find inspiration.';
            loader.style.display = 'none';
            return;
        }

        searchTitle.textContent = `Results for: "${capitalizeEachWord(query)}"`;
        loader.style.display = 'block';

        // Menggunakan Google Suggest untuk mendapatkan keyword terkait sebagai hasil pencarian
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleSearchResults&hl=en&client=firefox&q=${encodeURIComponent(query)}`;
        document.head.appendChild(script);
        script.onload = () => script.remove();
        script.onerror = () => {
            searchSubtitle.textContent = 'Could not fetch related keywords.';
            loader.style.display = 'none';
        }
    }

    // Callback function yang akan dipanggil oleh Google Suggest
    window.handleSearchResults = function(data) {
        // Gabungkan query asli dengan hasil suggestion untuk hasil yang lebih banyak
        const originalQuery = (new URLSearchParams(window.location.search).get('q') || '').replace(/-/g, ' ');
        const suggestions = data[1] || [];
        allKeywords = [originalQuery, ...suggestions.filter(s => s.toLowerCase() !== originalQuery.toLowerCase())];
        
        if (allKeywords.length > 0) {
            loadNextBatch();
            window.addEventListener('scroll', handleInfiniteScroll);
        } else {
            searchSubtitle.textContent = `No results found for "${originalQuery}".`;
            loader.style.display = 'none';
        }
    };

    initializeSearch();
});
