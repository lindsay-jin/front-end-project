"use strict";
/* exported data */
let data = {
    view: 'entry-form',
    entries: [],
    editing: null,
    nextEntryId: 1,
};
window.addEventListener('beforeunload', () => {
    const dataJSON = JSON.stringify(data);
    localStorage.setItem('data-model', dataJSON);
});
const storedData = localStorage.getItem('data-model');
if (storedData) {
    data = JSON.parse(storedData);
}
