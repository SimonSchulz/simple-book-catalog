import { searchBooks } from './api.js';
import {applyAuthorFilter, renderBooks, renderFavorites} from './ui.js';
import { initTheme } from "./theme.js";
import { debounce } from "./debounce.js";
import {cache} from "./cache.js";

const searchInput = document.getElementById('search-input');
const authorFilter = document.getElementById('author-filter');
const loadingIndicator = document.getElementById('loading');

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
    renderFavorites();
    initTheme();
    loadDefaultBooks();
});

/* =========================
   SEARCH
========================= */
async function handleSearch(query) {

    if (!query.trim()) {
        await loadDefaultBooks();
        return;
    }

    loadingIndicator.style.display = 'block';

    try {
        cache.books = await searchBooks(query);
        renderBooks(cache.books);
        updateAuthorFilter(cache.books);
    } catch (err) {
        console.error(err);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

/* =========================
   DEBOUNCE
========================= */
const debouncedSearch = debounce((e) => {
    handleSearch(e.target.value);
}, 400);

searchInput.addEventListener('input', debouncedSearch);

/* =========================
   FILTER
========================= */
authorFilter.addEventListener('change', (e) => {
    const filtered = applyAuthorFilter(e.target.value);
    renderBooks(filtered);
});

/* =========================
   AUTHOR SELECT
========================= */
function updateAuthorFilter(books) {
    const authors = new Set();

    books.forEach(b =>
        b.author_name?.forEach(a => authors.add(a))
    );

    const current = authorFilter.value;

    authorFilter.innerHTML = `<option value="">All authors</option>`;

    authors.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        authorFilter.appendChild(opt);
    });

    authorFilter.value = current;
}

/* =========================
   DEFAULT BOOKS
========================= */
async function loadDefaultBooks() {
    loadingIndicator.style.display = 'block';

    try {
        const books = await searchBooks('bestsellers');
        cache.books = books;
        renderBooks(books);
        updateAuthorFilter(books);
    } catch (err) {
        console.error(err);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}