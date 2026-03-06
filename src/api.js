import { cache } from './cache.js';

const SEARCH_URL = 'https://openlibrary.org/search.json?q=';
const WORKS_URL = 'https://openlibrary.org/works/';

const MAX_CACHE_SIZE = 10;

export async function searchBooks(query) {
    if (!query) throw new Error('Empty query');

    const normalizedQuery = query.toLowerCase().trim();

    if (cache.searchCache[normalizedQuery]) {
        console.log('Books loaded from cache');
        return cache.searchCache[normalizedQuery];
    }

    const response = await fetch(SEARCH_URL + encodeURIComponent(normalizedQuery));

    if (!response.ok) throw new Error('Network error');

    const data = await response.json();

    const books = data.docs.map(book => ({
        key: book.key,
        title: book.title,
        author_name: book.author_name,
        first_publish_year: book.first_publish_year,
        cover_i: book.cover_i
    }));

    cache.searchCache[normalizedQuery] = books;

    const keys = Object.keys(cache.searchCache);
    if (keys.length > MAX_CACHE_SIZE) {
        delete cache.searchCache[keys[0]];
    }

    return books;
}

export async function getBookDetails(workKey) {
    const olid = workKey.replace('/works/', '');

    const response = await fetch(`${WORKS_URL}${olid}.json`);

    if (!response.ok) throw new Error('Failed to fetch book details');

    const data = await response.json();

    return {
        title: data.title,
        description: data.description?.value || data.description || 'No description available',
        subjects: data.subjects || [],
        covers: data.covers || []
    };
}

export function getCoverURL(cover_i, size = 'M') {
    return cover_i
        ? `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`
        : './assets/book.svg';
}