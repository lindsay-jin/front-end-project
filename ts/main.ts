interface Obj {
  location?: string;
  keyword?: string;
  open?: boolean;
  show?: number;
  sortBy?: string;
  entryId?: number;
}

interface Favorites {
  photo: string;
  name: string;
  address: string;
  chair?: string | 'selectOne';
  wifi?: string | 'selectOne';
  temp?: string | 'selectOne';
  dog?: string | 'selectOne';
  noise?: string | 'selectOne';
  bathroom?: string | 'selectOne';
}

interface ListingDetails {
  name: string;
  address: string;
  photo: string;
}

// landing page
const $startSearchButton = document.querySelector('.start-search-button');

// search page
const $location = document.querySelector('.location-input') as HTMLInputElement;
const $keyword = document.querySelector('.keyword-input') as HTMLInputElement;
const $open = document.querySelector('#open') as HTMLFormElement;
const $show = document.querySelector('.show-input') as HTMLInputElement;
const $sort = document.querySelector('#sort') as HTMLFormElement;
const $resetButton = document.querySelector('.reset-button');

// pages
const $viewLanding = document.querySelector('div[data-view="landing"]');
const $listing = document.querySelector(
  'div[data-view="listing"]',
) as HTMLElement;
const $header = document.querySelector(
  'header[data-view="header"]',
) as HTMLElement;
const $footer = document.querySelector(
  'footer[data-view="footer"]',
) as HTMLElement;
const $form = document.querySelector(
  'div[data-view="form"]',
) as HTMLFormElement;
const $details = document.querySelector('div[data-view="details"]');
const $favorites = document.querySelector('div[data-view="favorites"]');
// view swap
function viewSwap(view: string): void {
  if (view === 'landing') {
    $viewLanding?.classList.remove('hidden');
    $header.classList.add('hidden');
    $form.classList.add('hidden');
    $footer.classList.add('hidden');
    $details?.classList.add('hidden');
    $listing.classList.add('hidden');
    $favorites?.classList.add('hidden');
  } else if (view === 'form') {
    $form.classList.remove('hidden');
    $listing.classList.remove('hidden');
    $viewLanding?.classList.add('hidden');
    $header.classList.remove('hidden');
    $footer.classList.remove('hidden');
    $details?.classList.add('hidden');
    $favorites?.classList.add('hidden');
  } else if (view === 'details') {
    $details?.classList.remove('hidden');
    $header.classList.remove('hidden');
    $footer.classList.remove('hidden');
    $viewLanding?.classList.add('hidden');
    $form.classList.add('hidden');
    $listing.classList.add('hidden');
    $favorites?.classList.add('hidden');
  } else if (view === 'favorites') {
    $favorites?.classList.remove('hidden');
    $details?.classList.add('hidden');
    $header.classList.remove('hidden');
    $footer.classList.remove('hidden');
    $viewLanding?.classList.add('hidden');
    $form.classList.add('hidden');
    $listing.classList.add('hidden');
  }
}

$startSearchButton?.addEventListener('click', (event: Event) => {
  viewSwap('form');
});

const $actualForm = document.querySelector('form') as HTMLFormElement;
$resetButton?.addEventListener('click', (event: Event) => {
  $actualForm.reset();
});

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'fsq3fiDFAJR1ZjTM79TGzTzCwyT25vUL31rgJOe5JqZ0sAY=',
  },
};

async function fetchPhotoId(id: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${id}/photos`,
      options,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const firstPhotoUrl = data[0].prefix + '300x300' + data[0].suffix;
      return firstPhotoUrl;
    } else {
      throw new Error('No photos available.');
    }
  } catch (error) {
    console.log('Failed to fetch photo ID:', error);
    throw error;
  }
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
    console.log('Failed to fetch obj:', error);
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
  $iHeart.className = 'fa-regular fa-heart heart-icon';

  if (data.likedEntries.some((item) => item.name === result.name)) {
    $iHeart.className = 'fa-solid fa-heart heart-icon';
  } else {
    $iHeart.className = 'fa-regular fa-heart heart-icon';
  }

  const $infoContainer = document.createElement('div');
  $infoContainer.className = 'info-container';

  const $nameContainer = document.createElement('div');
  const $addressContainer = document.createElement('div');

  const $listingName = document.createElement('h3');
  $listingName.className = 'listing-name';
  $listingName.textContent = 'Name: ';

  const $spanName = document.createElement('span');
  $spanName.className = 'span-name';
  $spanName.textContent = result.name;

  const $listingAddress = document.createElement('h3');
  $listingAddress.className = 'listing-address';
  $listingAddress.textContent = 'Address: ';

  const $spanAddress = document.createElement('span');
  $spanAddress.className = 'span-address';
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

// click on image to show details
$listing.addEventListener('click', (event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget && $eventTarget.tagName === 'IMG') {
    viewSwap('details');
    const closestElement = $eventTarget.closest('.listing-container');
    const $nameValue = closestElement?.querySelector('.span-name')
      ?.textContent as string;
    const $addressValue = closestElement?.querySelector('.span-address')
      ?.textContent as string;
    const photoUrl = $eventTarget.getAttribute('src') as string;
    const $listingDetails: ListingDetails = {
      name: $nameValue,
      address: $addressValue,
      photo: photoUrl,
    };

    if ($details) {
      $details.innerHTML = '';
    }
    const detailedEntry = renderDetails($listingDetails);
    $details?.prepend(detailedEntry);
  }
});

// nav bar
const $navSearchIcon = document.querySelector(
  '.nav-search-icon',
) as HTMLElement;
$navSearchIcon.addEventListener('click', (event: Event) => {
  viewSwap('form');
});

const $navHeartIcon = document.querySelector('.nav-heart-icon') as HTMLElement;
$navHeartIcon.addEventListener('click', (event: Event) => {
  viewSwap('favorites');
});

const $favoriteListings = document.querySelector('.favorite-listings');

// adding to the favorites page***************************
$listing.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget && $eventTarget.tagName === 'I') {
    const closestIcon = $eventTarget.closest('i') as HTMLElement;
    closestIcon.classList.toggle('fa-solid');
    closestIcon.classList.toggle('fa-regular');

    const likedListing = $eventTarget.closest(
      '.listing-container',
    ) as HTMLElement;

    const photoValue = likedListing
      .querySelector('.listing-image')
      ?.getAttribute('src') as string;
    const nameValue = likedListing.querySelector('.span-name')
      ?.textContent as string;
    const addressValue = likedListing.querySelector('.span-address')
      ?.textContent as string;

    const favorites: Favorites = {
      photo: photoValue,
      name: nameValue,
      address: addressValue,
      chair: 'selectOne',
      wifi: 'selectOne',
      temp: 'selectOne',
      dog: 'selectOne',
      noise: 'selectOne',
      bathroom: 'selectOne',
    };

    const result = {
      name: nameValue,
      location: { formatted_address: addressValue },
    };

    //when heart is solid
    if ($eventTarget.classList.contains('fa-solid')) {
      if (!data.likedEntries.some((list) => list.name === favorites.name)) {
        data.likedEntries.push(favorites);
        const favoriteEntry = renderEntry(result, photoValue) as HTMLElement;
        $favoriteListings?.prepend(favoriteEntry);
      }
    }
    //when heart is empty
    if ($eventTarget.classList.contains('fa-regular')) {
      const unLikedListing = $eventTarget.closest('.listing-container',) as HTMLElement;
      const $unLikedName = unLikedListing.querySelector('.span-name')?.textContent;

      data.likedEntries = data.likedEntries.filter(
        (list) => list.name !== $unLikedName,
      );
      //remove the DOM element from the favorites page
      const $listingsInFavorites = $favoriteListings?.querySelectorAll('.listing-container');
      $listingsInFavorites?.forEach(listing=>{
        const nameInListing = listing.querySelector('.span-name')?.textContent as string;
        if (nameInListing === $unLikedName) {
          listing.remove();
        }
      })
    }
  }
});

// details page clicking on heart
$details?.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget && $eventTarget.tagName === 'I') {
    const closestIcon = $eventTarget.closest('i') as HTMLElement;
    closestIcon.classList.toggle('fa-solid');
    closestIcon.classList.toggle('fa-regular');

    if ($eventTarget.classList.contains('fa-solid')) {
      const likedListing = $eventTarget.closest(
        '.details-container',
      ) as HTMLElement;

      const photoValue = likedListing
        .querySelector('.details-image')
        ?.getAttribute('src') as string;
      const nameValue = likedListing.querySelector('.details-span-name')
        ?.textContent as string;
      const addressValue = likedListing.querySelector('.details-span-address')
        ?.textContent as string;

      const favorites: Favorites = {
        photo: photoValue,
        name: nameValue,
        address: addressValue,
        chair: 'selectOne',
        wifi: 'selectOne',
        temp: 'selectOne',
        dog: 'selectOne',
        noise: 'selectOne',
        bathroom: 'selectOne',
      };

      const result = {
        name: nameValue,
        location: {
          formatted_address: addressValue,
        },
      };

      if (!data.likedEntries.some((list) => list.name === favorites.name)) {
        data.likedEntries.push(favorites);
        const favoriteEntry = renderEntry(result, photoValue) as HTMLElement;
        $favoriteListings?.prepend(favoriteEntry);
      }
    }
  }
});

// render details
function renderDetails(listing: ListingDetails): HTMLElement {
  const $detailsContainer = document.createElement('div');
  $detailsContainer.className = 'details-container';
  // left side
  const $detailsLeft = document.createElement('div');
  $detailsLeft.className = 'details-left';
  const $detailsImgContainer = document.createElement('div');
  $detailsImgContainer.className = 'details-img-container';
  const $detailsImage = document.createElement('img');
  $detailsImage.className = 'details-image';
  $detailsImage.setAttribute('src', listing.photo);
  const $iconContainer = document.createElement('div');
  $iconContainer.className = 'icon-container';
  const $heartIcon = document.createElement('i');
  $heartIcon.className = 'fa-regular fa-heart heart-icon';

  if (data.likedEntries.some((item) => item.name === listing.name)) {
    $heartIcon.className = 'fa-solid fa-heart heart-icon';
  } else {
    $heartIcon.className = 'fa-regular fa-heart heart-icon';
  }

  $detailsContainer.appendChild($detailsLeft);
  $detailsLeft.appendChild($detailsImgContainer);
  $detailsLeft.appendChild($iconContainer);
  $detailsImgContainer.appendChild($detailsImage);
  $iconContainer.appendChild($heartIcon);

  // right side
  const $detailsRight = document.createElement('div');
  $detailsRight.className = 'details-right';
  const $detailsInfoContainer = document.createElement('div');
  $detailsInfoContainer.className = 'details-info-container';
  const $nameTitle = document.createElement('h3');
  $nameTitle.textContent = 'Name: ';
  const $nameInfo = document.createElement('span');
  $nameInfo.className = 'details-span-name';
  $nameInfo.textContent = listing.name;
  const $addressTitle = document.createElement('h3');
  $addressTitle.textContent = 'Address: ';
  const $addressInfo = document.createElement('span');
  $addressInfo.className = 'details-span-address';
  $addressInfo.textContent = listing.address;

  $detailsContainer.appendChild($detailsRight);
  $detailsRight.appendChild($detailsInfoContainer);
  $detailsInfoContainer.appendChild($nameTitle);
  $detailsInfoContainer.appendChild($nameInfo);
  $detailsInfoContainer.appendChild($addressTitle);
  $detailsInfoContainer.appendChild($addressInfo);
  // details-extra: chair
  const $detailsExtra = document.createElement('div');
  $detailsExtra.className = 'details-extra';
  const $chairLabel = document.createElement('label');
  $chairLabel.setAttribute('for', 'chair');
  $chairLabel.textContent = 'Comfy Chair: ';
  const $chairSelect = document.createElement('select');
  $chairSelect.setAttribute('name', 'chair');
  $chairSelect.setAttribute('id', 'chair');
  $chairSelect.disabled = true; // Disables the select element
  const $chairOptionSelectOne = document.createElement('option');
  $chairOptionSelectOne.setAttribute('value', 'selectOne');
  $chairOptionSelectOne.textContent = 'Select One';
  const $chairOptionYes = document.createElement('option');
  $chairOptionYes.setAttribute('value', 'yes');
  $chairOptionYes.textContent = 'YES';
  const $chairOptionNo = document.createElement('option');
  $chairOptionNo.setAttribute('value', 'no');
  $chairOptionNo.textContent = 'NO';

  $detailsRight.appendChild($detailsExtra);
  $detailsExtra.appendChild($chairLabel);
  $detailsExtra.appendChild($chairSelect);
  $chairSelect.appendChild($chairOptionSelectOne);
  $chairSelect.appendChild($chairOptionYes);
  $chairSelect.appendChild($chairOptionNo);

  // wifi
  const $wifiLabel = document.createElement('label');
  $wifiLabel.setAttribute('for', 'wifi');
  $wifiLabel.textContent = 'Free Wifi: ';
  const $wifiSelect = document.createElement('select');
  $wifiSelect.setAttribute('name', 'wifi');
  $wifiSelect.setAttribute('id', 'wifi');
  $wifiSelect.disabled = true;
  const $wifiOptions = [
    { value: 'selectOne', text: 'Select One' },
    { value: 'yes', text: 'YES' },
    { value: 'no', text: 'NO' },
  ];
  $wifiOptions.forEach((opt) => {
    const $option = document.createElement('option');
    $option.value = opt.value;
    $option.textContent = opt.text;
    $wifiSelect.appendChild($option);
  });

  $detailsExtra.appendChild($wifiLabel);
  $detailsExtra.appendChild($wifiSelect);

  // temp
  const $tempLabel = document.createElement('label');
  $tempLabel.setAttribute('for', 'temp');
  $tempLabel.textContent = 'Temperature';
  const $tempSelect = document.createElement('select');
  $tempSelect.setAttribute('name', 'temp');
  $tempSelect.setAttribute('id', 'temp');
  $tempSelect.disabled = true;
  const $tempOptionSelectOne = document.createElement('option');
  $tempOptionSelectOne.value = 'selectOne';
  $tempOptionSelectOne.textContent = 'Select One';
  const $optionFreezing = document.createElement('option');
  $optionFreezing.value = 'freezing';
  $optionFreezing.textContent = 'Freezing!';
  const $optionCool = document.createElement('option');
  $optionCool.value = 'cool';
  $optionCool.textContent = 'Cool, bring a jacket';
  const $optionPerfect = document.createElement('option');
  $optionPerfect.value = 'perfect';
  $optionPerfect.textContent = 'Perfect';
  const $optionHot = document.createElement('option');
  $optionHot.value = 'hot';
  $optionHot.textContent = 'Too hot!';

  $detailsExtra.appendChild($tempLabel);
  $detailsExtra.appendChild($tempSelect);
  $tempSelect.appendChild($tempOptionSelectOne);
  $tempSelect.appendChild($optionFreezing);
  $tempSelect.appendChild($optionCool);
  $tempSelect.appendChild($optionPerfect);
  $tempSelect.appendChild($optionHot);

  // edit button
  const $editButtonContainer = document.createElement('div');
  $editButtonContainer.className = 'edit-button-container';
  const $editButton = document.createElement('button');
  $editButton.className = 'edit-button';
  $editButton.type = 'button';
  $editButton.textContent = 'EDIT';

  $detailsExtra.appendChild($editButtonContainer);
  $editButtonContainer.appendChild($editButton);

  return $detailsContainer;
}
// render favorites page
document.addEventListener('DOMContentLoaded', () => {
  data.likedEntries.forEach((favorite) => {
    $favoriteListings?.prepend(renderFavorites(favorite));
  });
});

// renderFavorites
function renderFavorites(favorite: Favorites): HTMLElement {
  const $listingContainer = document.createElement('div');
  $listingContainer.className = 'listing-container';

  const $listingImgContainer = document.createElement('div');
  $listingImgContainer.className = 'listing-img-container';

  const $listingImage = document.createElement('img');
  $listingImage.className = 'listing-image';
  $listingImage.setAttribute('src', favorite.photo);

  const $rightContainer = document.createElement('div');
  $rightContainer.className = 'right-container';

  const $heartContainer = document.createElement('div');
  $heartContainer.className = 'heart-container';

  const $iHeart = document.createElement('i');
  $iHeart.className = 'fa-solid fa-heart heart-icon';

  const $infoContainer = document.createElement('div');
  $infoContainer.className = 'info-container';

  const $nameContainer = document.createElement('div');
  const $addressContainer = document.createElement('div');

  const $listingName = document.createElement('h3');
  $listingName.className = 'listing-name';
  $listingName.textContent = 'Name: ';

  const $spanName = document.createElement('span');
  $spanName.className = 'span-name';
  $spanName.textContent = favorite.name;

  const $listingAddress = document.createElement('h3');
  $listingAddress.className = 'listing-address';
  $listingAddress.textContent = 'Address: ';

  const $spanAddress = document.createElement('span');
  $spanAddress.className = 'span-address';
  $spanAddress.textContent = favorite.address;

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

// details page from favorites page
$favoriteListings?.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget && $eventTarget.tagName === 'IMG') {
    viewSwap('details');
    const closestElement = $eventTarget.closest('.listing-container');
    const $nameValue = closestElement?.querySelector('.span-name')
      ?.textContent as string;
    const $addressValue = closestElement?.querySelector('.span-address')
      ?.textContent as string;
    const photoUrl = $eventTarget.getAttribute('src') as string;
    const $listingDetails: ListingDetails = {
      name: $nameValue,
      address: $addressValue,
      photo: photoUrl,
    };

    if ($details) {
      $details.innerHTML = '';
    }
    const detailedEntry = renderDetails($listingDetails);
    $details?.prepend(detailedEntry);
  }
});
