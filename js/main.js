"use strict";
//landing page
const $startSearchButton = document.querySelector('.start-search-button');
const $loginButton = document.querySelector('.login-button');
//search page
const $location = document.querySelector('.location-input');
const $keyword = document.querySelector('.keyword-input');
const $open = document.querySelector('#open');
const $show = document.querySelector('.show-input');
const $sort = document.querySelector('#sort');
const $resetButton = document.querySelector('.reset-button');
const $submitButton = document.querySelector('.submit-button');
const $viewLanding = document.querySelector('.view-landing');
const $viewSearch = document.querySelector('.view-search');
$startSearchButton?.addEventListener('click', () => {
    $viewLanding?.classList.add('hidden');
    $viewSearch?.classList.remove('hidden');
});
