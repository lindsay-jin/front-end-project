'use strict';
/* exported data */
let data = {
  view: 'landing',
  editing: null,
  nextEntryId: 1,
  likedEntries: [],
};
window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-model', dataJSON);
});
const storedData = localStorage.getItem('data-model');
if (storedData) {
  data = JSON.parse(storedData);
}
// When adding or removing favorites
//localStorage.setItem('favoritesList', JSON.stringify(favoritesList));
// On page load
//const storedFavorites = localStorage.getItem('favoritesList');
//if (storedFavorites) {
//  favoritesList = JSON.parse(storedFavorites);
//  updateFavoritesUI(); // Make sure to render the stored favorites
//}
