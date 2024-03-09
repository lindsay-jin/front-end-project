interface Obj {
  location?: string;
  keyword?: string;
  open?: boolean;
  show?: number;
  sortBy?: string;
}

// landing page
const $startSearchButton = document.querySelector('.start-search-button');

// search page
const $form = document.querySelector('form') as HTMLFormElement;
const $location = document.querySelector('.location-input') as HTMLInputElement;
const $keyword = document.querySelector('.keyword-input') as HTMLInputElement;
const $open = document.querySelector('#open') as HTMLFormElement;
const $show = document.querySelector('.show-input') as HTMLInputElement;
const $sort = document.querySelector('#sort') as HTMLFormElement;
const $resetButton = document.querySelector('.reset-button');

// listing
const $viewLanding = document.querySelector('.view-landing');
const $viewSearch = document.querySelector('.view-search');
const $listing = document.querySelector('.listing') as HTMLElement;

$startSearchButton?.addEventListener('click', () => {
  $viewLanding?.classList.add('hidden');
  $viewSearch?.classList.remove('hidden');
});

$resetButton?.addEventListener('click', (event: Event) => {
  event.preventDefault();
  $form.reset();
});

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'fsq3fiDFAJR1ZjTM79TGzTzCwyT25vUL31rgJOe5JqZ0sAY=',
  },
};

async function fetchPhotoId(id: string): Promise<string> {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/${id}/photos`,
    options,
  );
  const data = await response.json();

  const firstPhotoUrl = data[0].prefix + '300x300' + data[0].suffix;
  return firstPhotoUrl;
}

async function fetchInfo({
  keyword,
  location,
  open,
  show,
  sortBy,
}: Obj): Promise<void> {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${keyword}&near=${location}&open_now=${open}&sort=${sortBy}&limit=${show}`,
      options,
    );
    const data = await response.json();

    if (!data) {
      throw new Error('Nothing found within the search parameter.');
    }

    data.results.forEach(async (result: any) => {
      const photo = await fetchPhotoId(result.fsq_id); // the photo for each place
      const entryElement = renderEntry(result, photo); // the rendered DOM tree
      $listing.prepend(entryElement);
    });
  } catch (error) {
    console.log(error);
  }
}

// submit **************************************
$form?.addEventListener('submit', (event: Event) => {
  event?.preventDefault();

  while ($listing.firstChild) {
    $listing.removeChild($listing.firstChild);
  }

  const locationValue = $location.value;
  const keywordValue = $keyword.value;
  const openValue = $open.value;
  const showValue = Number($show.value);
  const sortValue = $sort.value;

  const obj: Obj = {
    location: locationValue || '',
    keyword: keywordValue || '',
    open: openValue ? Boolean(openValue) : true,
    show: showValue || 10,
    sortBy: sortValue || 'relevance',
  };

  fetchInfo(obj);
});

// render entry**************************
function renderEntry(result: any, photo: string): HTMLElement {
  const $listingContainer = document.createElement('div');
  $listingContainer.className = 'listing-container';

  const $listingImgContainer = document.createElement('div');
  $listingImgContainer.className = 'listing-img-container';

  const $listingImage = document.createElement('img');
  $listingImage.className = 'listing-image';
  $listingImage.setAttribute('src', photo);

  const $rightContainer = document.createElement('div');
  $rightContainer.className = 'right-container';

  const $heartContainer = document.createElement('div');
  $heartContainer.className = 'heart-container';

  const $iHeart = document.createElement('i');
  $iHeart.className = 'fa-regular fa-heart';

  const $infoContainer = document.createElement('div');
  $infoContainer.className = 'info-container';

  const $nameContainer = document.createElement('div');
  const $addressContainer = document.createElement('div');

  const $listingName = document.createElement('h3');
  $listingName.className = 'listing-name';
  $listingName.textContent = 'Name: ';

  const $spanName = document.createElement('span');
  $spanName.textContent = result.name;

  const $listingAddress = document.createElement('h3');
  $listingAddress.className = 'listing-address';
  $listingAddress.textContent = 'Address: ';

  const $spanAddress = document.createElement('span');
  $spanAddress.textContent = result.location.formatted_address;

  $listingContainer.appendChild($listingImgContainer);
  $listingContainer.appendChild($rightContainer);

  $rightContainer.appendChild($heartContainer);
  $rightContainer.appendChild($infoContainer);

  $listingImgContainer.appendChild($listingImage);
  $heartContainer.appendChild($iHeart);

  $infoContainer.appendChild($nameContainer);
  $infoContainer.appendChild($addressContainer);

  $nameContainer.appendChild($listingName);
  $nameContainer.appendChild($spanName);
  $addressContainer.appendChild($listingAddress);
  $addressContainer.appendChild($spanAddress);

  return $listingContainer;
}
