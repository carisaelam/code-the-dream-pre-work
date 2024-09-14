const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const imageId = urlParams.get('image_id');
const id = urlParams.get('id');

console.log('id', id);

// Constants
const ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const IMAGE_REQUEST_PARAMS = 'full/843,/0/default.jpg';
const FIELDS =
  'fields=title,id,image_id,artist_title,color,subject_title,theme_titles,colorfulness,description';
const IMAGE_CONFIG = 'https://www.artic.edu/iiif/2';

// Variables
let topImages = [];
let searchUrl = `${ENDPOINT}/${id}/?${FIELDS}`;

console.log('searchUrl', searchUrl);

// Helper Functions
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

function buildImageUrl(config, imageId) {
  return `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
}

async function buildImageInfo(imageUrl) {
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
}

// Build object representing a single image

// Display art in the container
function displayArt(imageInfo) {
  if (imageInfo) {
    const artContainer = document.querySelector('.art__container');
    artContainer.innerHTML = `
      <img src="${imageInfo.url}" alt="${imageInfo.title}">
      <h3>${imageInfo.title}</h3>
      <p>${imageInfo.artist}</p>
    `;
  } else {
    console.error('Invalid image info.');
  }
}

// Build and display image based on search keywords
async function buildKeywordSearchImageInfo(searchUrl) {
  try {
    console.log(`Running buildKeywordSearchImageInfo with URL: ${searchUrl}`);
    const data = await fetchData(searchUrl);

    const image = data.data;

    console.log('image', image);

    displayArt(image);
  } catch (error) {
    console.error('Error building keyword search image info:', error);
  }
}

// Display a single image and set background color
function displaySingleImage(image) {
  console.log('displaying single image:', image);
  if (image) {
    const artContainer = document.querySelector('.keyword__art__container');
    const body = document.querySelector('.body');

    let descriptionHTML = `<p>No description available. </p><a href="https://www.artic.edu/artworks/${image.id}/" target="_blank">
    <p>Learn More Here!</p>    
  </a>`;
    if (image.description) {
      descriptionHTML = ` <h3>Description</h3>
      <p>${image.description}</p>`;
    }

    let subjectTitleHTML = '';
    if (image.subjectTitle) {
      subjectTitleHTML = `<h3>Subject Title</h3>
      <p>${image.subjectTitle}</p>`;
    }

    artContainer.innerHTML = `
      <img src="${image.url}" alt="${image.title}">
      
       <h3>${image.title}</h3>    
     
      
       <a href="http://www.google.com/search?q=${encodeURIComponent(image.artist)}" target="_blank">
         <p>${image.artist}</p>    
       </a>

       ${descriptionHTML}
       ${subjectTitleHTML}

       
      
    `;
    body.style.backgroundColor = `hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%)`;
  } else {
    console.error('Invalid image info.');
  }
}

// Event Listener
console.log(buildImageInfo(searchUrl));
// displaySingleImage(image);
