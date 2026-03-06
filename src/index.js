import { searchBooks } from './api.js'
import { renderBooks, renderFavorites } from './ui.js';
import { debounce } from './debounce.js';
import { initTheme } from './theme.js';
import {cache} from "./cache";

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        document.getElementById('results').textContent = 'Please enter a search term';
        return;
    }

    document.getElementById('results').textContent = 'Loading...';
    try {
        const books = await searchBooks(query);
        renderBooks(books);
    } catch (err) {
        document.getElementById('results').textContent = 'Error fetching books';
        console.error(err);
    }
}

searchInput.addEventListener('input', debounce(handleSearch, 500));
searchBtn.addEventListener('click', handleSearch);

document.getElementById('author-filter').addEventListener('change', () => {
    renderBooks(cache.books);
});

renderFavorites();
initTheme();