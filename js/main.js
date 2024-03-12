'use strict';
// landing page
const $startSearchButton = document.querySelector('.start-search-button');
// search page
const $location = document.querySelector('.location-input');
const $keyword = document.querySelector('.keyword-input');
const $open = document.querySelector('#open');
const $show = document.querySelector('.show-input');
const $sort = document.querySelector('#sort');
const $resetButton = document.querySelector('.reset-button');
// pages
const $viewLanding = document.querySelector('div[data-view="landing"]');
const $listing = document.querySelector('div[data-view="listing"]');
const $header = document.querySelector('header[data-view="header"]');
const $footer = document.querySelector('footer[data-view="footer"]');
const $form = document.querySelector('div[data-view="form"]');
const $details = document.querySelector('div[data-view="details"]');
const $favorites = document.querySelector('div[data-view="favorites"]');
// view swap
function viewSwap(view) {
  console.log(`viewSwap called with view: ${view}`);
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
$startSearchButton?.addEventListener('click', (event) => {
  event?.preventDefault();
  viewSwap('form');
});
$resetButton?.addEventListener('click', (event) => {
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
async function fetchPhotoId(id) {
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
async function fetchInfo({ keyword, location, open, show, sortBy }) {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${keyword}&near=${location}&open_now=${open}&sort=${sortBy}&limit=${show}`,
      options,
    );
    const data = await response.json();
    if (!data) {
      throw new Error('Nothing found within the search parameter.');
    }
    data.results.forEach(async (result) => {
      const photo = await fetchPhotoId(result.fsq_id); // the photo for each place
      const entryElement = renderEntry(result, photo); // the rendered DOM tree
      $listing.prepend(entryElement);
    });
  } catch (error) {
    console.log('Failed to fetch obj:', error);
  }
}
// submit **************************************
$form?.addEventListener('submit', (event) => {
  event?.preventDefault();
  while ($listing.firstChild) {
    $listing.removeChild($listing.firstChild);
  }
  const locationValue = $location.value;
  const keywordValue = $keyword.value;
  const openValue = $open.value;
  const showValue = Number($show.value);
  const sortValue = $sort.value;
  const obj = {
    location: locationValue || '',
    keyword: keywordValue || '',
    open: openValue ? Boolean(openValue) : true,
    show: showValue || 10,
    sortBy: sortValue || 'relevance',
  };
  fetchInfo(obj);
});
// render entry**************************
function renderEntry(result, photo) {
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
const $detailsImage = document.querySelector('.details-image');
const $detailsSpanName = document.querySelector('.details-span-name');
const $detailsSpanAddress = document.querySelector('.details-span-address');
// click on image to show details
document.addEventListener('DOMContentLoaded', () => {
  $listing.addEventListener('click', (event) => {
    event.preventDefault();
    const $eventTarget = event.target;
    // console.log('eventTarget', $eventTarget)
    // console.log('tagName', $eventTarget.tagName);
    if ($eventTarget && $eventTarget.tagName === 'IMG') {
      viewSwap('details');
      const closestElement = $eventTarget.closest('.listing-image');
      const detailsImgUrl = closestElement?.getAttribute('src');
      $detailsImage?.setAttribute('src', detailsImgUrl);
      const closestParent = $eventTarget.closest('div[data-view="listing"]');
      const spanName = closestParent.querySelector('.span-name');
      $detailsSpanName.textContent = spanName.textContent;
      const spanAddress = closestParent.querySelector('.span-address');
      $detailsSpanAddress.textContent = spanAddress.textContent;
    }
  });
});
// nav bar
const $navSearchIcon = document.querySelector('.nav-search-icon');
$navSearchIcon.addEventListener('click', (event) => {
  event.preventDefault();
  viewSwap('form');
});
const $navHeartIcon = document.querySelector('.nav-heart-icon');
$navHeartIcon.addEventListener('click', (event) => {
  event.preventDefault();
  viewSwap('favorites');
});
// adding to the favorites page (can we make it cleaner?)
document.addEventListener('DOMContentLoaded', () => {
  $listing.addEventListener('click', (event) => {
    event.preventDefault();
    const $eventTarget = event.target;
    console.log('eventTarget', $eventTarget);
    if ($eventTarget && $eventTarget.tagName === 'I') {
      const closestIcon = $eventTarget.closest('i');
      closestIcon.classList.toggle('fa-solid');
      closestIcon.classList.toggle('fa-regular');
      if ($eventTarget.classList.contains('fa-solid')) {
        const likedListing = closestIcon.closest('.listing-container');
        console.log(likedListing);
      }
    }
  });
});
const $detailsLeft = document.querySelector('.details-left');
document.addEventListener('DOMContentLoaded', () => {
  $detailsLeft.addEventListener('click', (event) => {
    event.preventDefault();
    const $eventTarget = event.target;
    console.log('eventTarget', $eventTarget);
    if ($eventTarget && $eventTarget.tagName === 'I') {
      const closestIcon = $eventTarget.closest('i');
      closestIcon.classList.toggle('fa-solid');
      closestIcon.classList.toggle('fa-regular');
    }
  });
});
//
