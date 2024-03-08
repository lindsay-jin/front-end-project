"use strict";
//landing page
const $startSearchButton = document.querySelector('.start-search-button');
const $loginButton = document.querySelector('.login-button');
//search page
const $form = document.querySelector('form');
const $location = document.querySelector('.location-input');
let locationValue = $location.value;
const $keyword = document.querySelector('.keyword-input');
const keywordValue = $keyword.value;
const $open = document.querySelector('#open');
const openValue = $open.value;
const $show = document.querySelector('.show-input');
//????? why can't I assign showValue as a number?
const showValue = $show.value;
const $sort = document.querySelector('#sort');
const sortValue = $sort.value;
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
$submitButton?.addEventListener('click', (event) => {
    event?.preventDefault();
    let obj = {
        location: locationValue ? locationValue : '',
        keyword: keywordValue ? keywordValue : '',
        open: openValue ? openValue : '',
        show: showValue ? showValue : 10,
        sortBy: sortValue ? sortValue : 'relevance',
    };
    console.log(locationValue);
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
            const response = await fetch('https://api.foursquare.com/v3/places/search?query=${keywordValue}', options);
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
            // $listingName.textContent = 'Name: ' + data.results[0].name;
            // $listingAddress.textContent = 'Address: ' + data.results[0].location.formatted_address;
        }
        catch (error) {
            console.log(error);
        }
    }
    fetchInfo();
    $listing.prepend(renderEntry(obj));
});
function renderEntry(entry) {
    // const $listing = document.createElement('div');
    // $listing.className = 'listing';
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
    //$listingName.textContent = ;
    const $listingAddress = document.createElement('h3');
    $listingAddress.className = 'listing-address';
    //$listingAddress.textContent = ;
    $listingContainer.appendChild($listingImgContainer);
    $listingContainer.appendChild($heartContainer);
    $listingContainer.appendChild($infoContainer);
    $listingImgContainer.appendChild($listingImage);
    $heartContainer.appendChild($iHeart);
    $infoContainer.appendChild($listingName);
    $infoContainer.appendChild($listingAddress);
    console.log(entry);
    return $listingContainer;
}
document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < data.entries.length; i++) {
        const currentEntry = renderEntry(data.entries[i]);
        $listing?.appendChild(currentEntry);
    }
});
