const ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const IMAGE_REQUEST_PARAMS = 'full/843,/0/default.jpg';

const id = 26314;
let keyword;
const fields = 'fields=title,id,image_id,artist_title,color';
let url = `${ENDPOINT}/${id}/?${fields}`;

// Retrieves all art from API. Useful as a helper.
async function getAllArt() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

// Builds object representing a single image
async function buildImageInfo() {
  console.log(`running buildImageInfo with url: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();

    // Attributes of image
    const imageId = data.data.image_id;
    const title = data.data.title;
    const artist = data.data.artist_title;
    const color = data.data.color;
    const config = data.config.iiif_url;

    const imageUrl = `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
    const imageInfo = { url: imageUrl, title: title, artist: artist };
    return imageInfo;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Calls buildImageInfo and inserts fetched image into artContainer div
function displayArt() {
  console.log(`running displayArt with url: ${url}`);
  buildImageInfo()
    .then((imageInfo) => {
      if (imageInfo) {
        const artContainer = document.querySelector('.art__container');

        artContainer.innerHTML = `
            <img src='${imageInfo.url}'>
            <h3>${imageInfo.title}</h3>
            <p>${imageInfo.artist}</p>

            `;
      } else {
        console.error(`Invalid image URL.`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// SEARCH FORM

const searchForm = document.querySelector('.search__form');

function getKeyword(e) {
  e.preventDefault();
  const input = document.getElementById('keyword__input');
  const newKeyword = input.value;

  buildKeywordSearchUrl(newKeyword);
}

searchForm.addEventListener('submit', getKeyword);

function buildKeywordSearchUrl(keyword) {
  console.log(`buildKeywordSearchUrl by: ${keyword}`);
  searchUrl = `${ENDPOINT}/search?q=${keyword}&${fields}`;
  console.log(`searchUrl: ${searchUrl}`);
  buildKeywordSearchImageInfo(searchUrl);
}

const searchedImages = [];

async function buildKeywordSearchImageInfo(searchUrl) {
  console.log(`buildKeywordSearchImageInfo by: ${searchUrl}`);

  const response = await fetch(searchUrl);
  if (!response.ok) {
    throw new Error(`${response.status}`);
  }
  const data = await response.json();
  const config = data.config.iiif_url;

  const images = data.data;

  images.forEach((image) => {
    const imageId = image.image_id;
    const title = image.title;
    const artist = image.artist_title;
    const color = image.color;

    const imageUrl = `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
    const imageInfo = {
      url: imageUrl,
      title: title,
      artist: artist,
      color: color,
    };
    searchedImages.push(imageInfo);
  });
  console.log('searchedImages array: ', searchedImages);
  getTopImage(searchedImages);
}

function getTopImage(array) {
  console.log('get top image running');
  console.log(array);
  displaySingleImage(array[0]);
}

function displaySingleImage(image) {
  if (image) {
    const artContainer = document.querySelector('.art__container');
    const mainContainer = document.querySelector('.main__container');

    artContainer.innerHTML = `
            <img src='${image.url}'>
            <h3>${image.title}</h3>
            <p>${image.artist}</p>
            <p>hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%)</p>

            `;
    mainContainer.style.backgroundColor = `hsl(${image.color.h}, ${image.color.s}%, ${image.color.l}%)`;
  } else {
    console.error(`Invalid image URL.`);
  }
}
