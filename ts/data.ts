/* exported data */

interface Data {
  view: string;
  editing: Obj | null;
  nextEntryId: number;
  likedEntries: Obj[] | null;
}

let data: Data = {
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
