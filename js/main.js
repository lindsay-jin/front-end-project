"use strict";
//landing page
const $startSearchButton = document.querySelector('.start-search-button');
const $loginButton = document.querySelector('.login-button');
//search page
const $form = document.querySelector('form');
const $location = document.querySelector('.location-input');
const $keyword = document.querySelector('.keyword-input');
const $open = document.querySelector('#open');
const $show = document.querySelector('.show-input');
const $sort = document.querySelector('#sort');
const $resetButton = document.querySelector('.reset-button');
const $submitButton = document.querySelector('.submit-button');
//listing
const $viewLanding = document.querySelector('.view-landing');
const $viewSearch = document.querySelector('.view-search');
const $listing = document.querySelector('.listing');
const $listingName = document.querySelector('.listing-name');
const $listingAddress = document.querySelector('.listing-address');
$startSearchButton?.addEventListener('click', () => {
    $viewLanding?.classList.add('hidden');
    $viewSearch?.classList.remove('hidden');
});
$resetButton?.addEventListener('click', (event) => {
    event.preventDefault();
    $form.reset();
});
//submit **************************************
$form?.addEventListener('submit', (event) => {
    event?.preventDefault();
    const locationValue = $location.value;
    const keywordValue = $keyword.value;
    const openValue = $open.value;
    const showValue = Number($show.value);
    const sortValue = $sort.value;
    let obj = {
        location: locationValue ? locationValue : '',
        keyword: keywordValue ? keywordValue : '',
        open: openValue ? openValue : '',
        show: showValue ? showValue : 10,
        sortBy: sortValue ? sortValue : 'relevance',
    };
    data.nextEntryId++;
    data.entries.unshift(obj);
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3fiDFAJR1ZjTM79TGzTzCwyT25vUL31rgJOe5JqZ0sAY=',
        },
    };
    async function fetchInfo() {
        try {
            const response = await fetch(`https://api.foursquare.com/v3/places/search?query=${keywordValue}&near=${locationValue}&open_now=${openValue}&sort=${sortValue}&limit=${showValue}`, options);
            const data = await response.json();
            console.log(data);
            if (!data) {
                throw new Error('Nothing found within the search parameter.');
            }
            ;
            if (data !== undefined) {
                $listing.classList.add('white');
            }
            ;
            data.results.forEach((result) => {
                const entryElement = renderEntry(result); //the rendered DOM tree
                $listing.prepend(entryElement);
            });
        }
        catch (error) {
            console.log(error);
        }
    }
});
//render entry**************************
function renderEntry(result) {
    const $listingContainer = document.createElement('div');
    $listingContainer.className = 'listing-container';
    const $listingImgContainer = document.createElement('div');
    $listingImgContainer.className = 'listing-img-container';
    const $listingImage = document.createElement('img');
    $listingImage.className = 'listing-image';
    const $heartContainer = document.createElement('div');
    $heartContainer.className = 'heart-container';
    const $iHeart = document.createElement('i');
    $iHeart.className = 'fa-regular fa-heart';
    const $infoContainer = document.createElement('div');
    $infoContainer.className = 'info-container';
    const $listingName = document.createElement('h3');
    $listingName.className = 'listing-name';
    $listingName.textContent = result.name;
    const $listingAddress = document.createElement('h3');
    $listingAddress.className = 'listing-address';
    $listingAddress.textContent = result.location.formatted_address;
    $listingContainer.appendChild($listingImgContainer);
    $listingContainer.appendChild($heartContainer);
    $listingContainer.appendChild($infoContainer);
    $listingImgContainer.appendChild($listingImage);
    $heartContainer.appendChild($iHeart);
    $infoContainer.appendChild($listingName);
    $infoContainer.appendChild($listingAddress);
    console.log(result);
    return $listingContainer;
}
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < data.entries.length; i++) {
        const currentEntry = renderEntry(data.entries[i]);
        $listing?.appendChild(currentEntry);
    }
});
