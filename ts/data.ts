/* exported data */

interface Data {
  view: string;
  entries: Obj[];
  editing: Obj | null;
  nextEntryId: number;
}

let data: Data = {
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
