// Constants
const ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const IMAGE_REQUEST_PARAMS = 'full/843,/0/default.jpg';
const FIELDS = 'fields=title,id,image_id,artist_title,color,subject_titles';

// Variables
let topImages = [];

// Helper Functions
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

function buildImageUrl(config, imageId) {
  return `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
}

function randomItemFromArray(array) {
  if (array.length === 0) return null;
  randomIndex = Math.floor(Math.random() * array.length);
  randomItem = array[randomIndex];
  return randomItem;
}

// Retrieve all art from API
async function getAllArt() {
  try {
    const url = `${ENDPOINT}/26314/?${FIELDS}`;
    const data = await fetchData(url);
    console.log(data);
  } catch (error) {
    console.error('Error fetching all art:', error);
  }
}

// Build object representing a single image
async function buildImageInfo() {
  try {
    const url = `${ENDPOINT}/26314/?${FIELDS}`;
    console.log(`Running buildImageInfo with URL: ${url}`);

    const data = await fetchData(url);
    const { image_id: imageId, title, artist_title: artist, color } = data.data;
    const { iiif_url: config } = data.config;

    return {
      url: buildImageUrl(config, imageId),
      title,
      artist,
    };
  } catch (error) {
    console.error('Error building image info:', error);
    return null;
  }
}

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
    const { iiif_url: config } = data.config;
    const allImages = data.data;

    // Only selects from the top 10 images in the search
    topImages = allImages.slice(0, 10).map((image) => ({
      url: buildImageUrl(config, image.image_id),
      title: image.title,
      artist: image.artist_title,
      color: image.color,
    }));

    console.log('Searched images:', topImages);
    displaySingleImage(randomItemFromArray(topImages));
  } catch (error) {
    console.error('Error building keyword search image info:', error);
  }
}

// Handle search form submission
function getKeyword(event) {
  event.preventDefault();
  const input = document.getElementById('keyword__input');
  const keyword = input.value.trim();

  if (keyword) {
    const searchUrl = `${ENDPOINT}/search?q=${keyword}&${FIELDS}`;
    buildKeywordSearchImageInfo(searchUrl);
    input.value = '';
  }
}

// Display a single image and set background color
function displaySingleImage(image) {
  if (image) {
    const artContainer = document.querySelector('.art__container');
    const mainContainer = document.querySelector('.main__container');

    artContainer.innerHTML = `
      <img src="${image.url}" alt="${image.title}">
      <h3>${image.title}</h3>
      <p>${image.artist}</p>
      <p>hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%)</p>
    `;
    mainContainer.style.backgroundColor = `hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%)`;
  } else {
    console.error('Invalid image info.');
  }
  topImages = [];
}

// Event Listener
document.querySelector('.search__form').addEventListener('submit', getKeyword);

// Initial Call (if needed)
// getAllArt();
