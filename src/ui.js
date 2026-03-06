import { saveFavorite, removeFavorite, getFavorites } from './storage.js';
import { getBookDetails, getCoverURL } from './api.js';
import {cache} from "./cache.js";

const resultsContainer = document.getElementById('results');
const favoritesContainer = document.getElementById('favorite-list');
const favoriteSection = document.getElementById('favorites-section');
let modal = null;

export function renderBooks(books) {
    cache.filteredBooks = books;
    renderBookCards(cache.filteredBooks);
}

function renderBookCards(books) {
    resultsContainer.innerHTML = '';
    if (!books.length) {
        resultsContainer.textContent = 'No books found';
        return;
    }

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';

        const cover = getCoverURL(book.cover_i, 'M');

        card.innerHTML = `
            <img src="${cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author_name ? book.author_name.join(', ') : 'Unknown author'}</p>
            <p>${book.first_publish_year || 'Unknown year'}</p>
        `;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = isFavorite(book.key)
            ? `<img src="../assets/heart-filled.svg" alt="Remove">`
            : `<img src="../assets/heart.svg" alt="Favorite">`;

        favoriteBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleFavorite(book);
            favoriteBtn.innerHTML = isFavorite(book.key)
                ? `<img src="../assets/heart-filled.svg" alt="Remove">`
                : `<img src="../assets/heart.svg" alt="Favorite">`;
        });

        card.appendChild(favoriteBtn);

        card.addEventListener('click', async () => {
            try {
                const details = await getBookDetails(book.key);
                showModal(details, book);
            } catch (err) {
                alert('Failed to load book details');
                console.error(err);
            }
        });

        resultsContainer.appendChild(card);
    });
}


function showModal(details, book) {
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img src="${details.covers.length ? getCoverURL(details.covers[0], 'L') : './assets/book.svg'}" alt="${details.title}" class="modal-cover">
            <h2>${details.title}</h2>
            <p>${details.description}</p>
            <p><strong>Subjects:</strong> ${details.subjects.join(', ') || 'N/A'}</p>
            <button class="favorite-btn-modal">
                ${isFavorite(book.key) ?
        `<img src="../assets/heart-filled.svg" alt="Remove">` :
        `<img src="../assets/heart.svg" alt="Favorite">`}
            </button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });

    const favBtnModal = modal.querySelector('.favorite-btn-modal');
    favBtnModal.addEventListener('click', () => {
        toggleFavorite(book);
        favBtnModal.innerHTML = isFavorite(book.key)
            ? `<img src="../assets/heart-filled.svg" alt="Remove">`
            : `<img src="../assets/heart.svg" alt="Favorite">`;
    });
}

function isFavorite(bookKey) {
    return getFavorites().some(b => b.key === bookKey);
}

function toggleFavorite(book) {
    if (isFavorite(book.key)) removeFavorite(book.key);
    else saveFavorite(book);

    renderBookCards(cache.filteredBooks);
    renderFavorites();
}

export function renderFavorites() {
    favoritesContainer.innerHTML = '';
    const favorites = getFavorites();
    if (!favorites.length) {
        favoriteSection.style.display = 'none';
        return;
    }else{
        favoriteSection.style.display = 'block';
    }

    favorites.forEach(book => {
        const card = document.createElement('div');
        card.className = 'favorite-book-card';

        const cover = getCoverURL(book.cover_i, 'M');

        card.innerHTML = `
            <img src="${cover}" alt="${book.title}">
            <div>
            <h3>${book.title}</h3>
            <p>${book.author_name ? book.author_name.join(', ') : 'Unknown author'}</p>
            <p>${book.first_publish_year || 'Unknown year'}</p>
            </div>
        `;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-favorite-btn';
        removeBtn.innerHTML = `<img src="../assets/heart-filled.svg" alt="Remove">`;
        removeBtn.addEventListener('click', () => {
            toggleFavorite(book);
        });

        card.appendChild(removeBtn);
        favoritesContainer.appendChild(card);
    });
}

export function applyAuthorFilter(author) {
    if(author==="")
        return cache.filteredBooks=cache.books;
    cache.selectedAuthor = author;
    return cache.filteredBooks = cache.books.filter(
        b => b.author_name?.includes(author)
    );
}
