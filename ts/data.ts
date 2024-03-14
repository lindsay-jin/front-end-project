/* exported data */

interface Data {
  likedEntries: Favorites[];
  editedEntries: [];
}

let data: Data = {
  likedEntries: [],
  editedEntries: [],
};

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-model', dataJSON);
  // stores the serialized data in the browser's local storage under the key 'data-model'
});

const storedData = localStorage.getItem('data-model');
if (storedData) {
  data = JSON.parse(storedData);
}
