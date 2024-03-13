'use strict';
/* exported data */
let data = {
  likedEntries: [],
};
window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('data-model', dataJSON);
  //stores the serialized data in the browser's local storage under the key 'data-model'
});
const storedData = localStorage.getItem('data-model');
if (storedData) {
  data = JSON.parse(storedData);
}
