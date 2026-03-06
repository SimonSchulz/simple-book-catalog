const FAVORITES_KEY = 'favoriteBooks';

export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

export function saveFavorite(book) {
    const favorites = getFavorites();
    if (!favorites.some(b => b.key === book.key)) {
        favorites.push(book);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeFavorite(bookKey) {
    const favorites = getFavorites().filter(b => b.key !== bookKey);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}