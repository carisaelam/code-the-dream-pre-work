// Variables
const ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const IMAGE_REQUEST_PARAMS = 'full/843,/0/default.jpg';
const FIELDS =
  'fields=title,id,image_id,artist_title,color,subject_title,theme_titles,colorfulness,description';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const imageId = urlParams.get('image_id');
const id = urlParams.get('id');
const searchUrl = `${ENDPOINT}/${id}/?${FIELDS}`;

// Document elements
const artContainer = document.querySelector('.display__art__container');
const displayContainer = document.querySelector('.display__container');
const displayHeaderTitle = document.querySelector('.display__header__title');

// Functions
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

function buildImageUrl(config, imageId) {
  return `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
}

async function buildImageInfo(imageUrl) {
  try {
    data = await fetchData(imageUrl);
    const {
      id,
      image_id: imageId,
      title,
      artist_title: artist,
      color,
      subject_title: subjectTitle,
      theme_titles: themeTitle,
      colorfulness,
      description,
    } = data.data;

    const { iiif_url: config } = data.config;

    const imageInfo = {
      url: buildImageUrl(config, imageId),
      id,
      title,
      artist,
      color,
      subjectTitle,
      themeTitle,
      colorfulness,
      description,
    };

    displaySingleImage(imageInfo);
  } catch (error) {
    console.error('Error building image information: ', error);
  }
}

function displayArt(imageInfo) {
  if (imageInfo) {
    artContainer.innerHTML = `
      <img src="${imageInfo.url}" alt="${imageInfo.title}">
      <h3>${imageInfo.title}</h3>
      <p>${imageInfo.artist}</p>
    `;
  } else {
    console.error('Invalid image info.');
  }
}

function displaySingleImage(image) {
  if (image) {
    const descriptionHTML = image.description
      ? ` <h3>Description</h3><p>${image.description}</p>`
      : `<div class="display__no__description__container">
      <p>No description available. </p>
      <a href="https://www.artic.edu/artworks/${image.id}/" target="_blank">
        <p>Learn More Here!</p>
      </a>
    </div>
    `;

    artContainer.innerHTML = `
    
      <div class="display__art__image__container">
        <img src="${image.url}" alt="${image.title}">
      </div>
     
      <div class="display__art__details__container">
        <div class="display__art__details__title__container">
          <h2>${image.title}</h2>
        </div>
     
        <div class="display__art__artist__container">
          <a href="http://www.google.com/search?q=${encodeURIComponent(image.artist)}" target="_blank">
          <h3>${image.artist}</h3>
          </a>
        </div>
     
        <div class="display__art__description__container">
          ${descriptionHTML}
        </div>
        
      </div>

    `;
    displayContainer.style.background = `linear-gradient(120deg, hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%), hsl(${image.color.h}, ${image.color.s}%, ${image.color.l + 20}%))`;

    displayHeaderTitle.textContent = `${image.title}`;
  } else {
    console.error('Invalid image info.');
  }
}

// Triggers all the functions
buildImageInfo(searchUrl);
