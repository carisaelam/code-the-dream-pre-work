// Variables
const image_config = 'https://www.artic.edu/iiif/2';
let artList = [];
let searchTerm = '';
let limit = 10;

// DOM elements
const artContainer = document.querySelector('.art__container');
const galleryDescriptionContainer = document.querySelector(
  '.gallery__description__container'
);
const galleryForm = document.querySelector('.gallery__form');
const galleryFormInput = document.getElementById('gallery__form__input');
const limitForm = document.querySelector('.limit__form');
const limitFormInput = document.getElementById('limit__form__input');

// HTML--Text elements
const displayArtDirectionsHTML =
  'Click on each image to learn more about the artwork!';
const noArtToDisplayText = 'No art to display. Try a different search.';

function displayArtHTML(item) {
  return `
      <div class="gallery__image__container"> 
        <a href="display.html?image_id=${item.imageId}&id=${item.id}">
          <img src="${image_config}/${item.imageId}/full/843,/0/default.jpg" alt="Image unavailable at this time" onerror="this.style.display='none'" class="gallery__image" >
        </a>
      </div>
      <div class="gallery__image__information__container">
        <h3 class="gallery__image__title">${item.title}</h3>      
        <p class="gallery__image__artist">${item.artist}</p>      
      </div>
    `;
}

// Functions

// Main API call with dynamic searchTerm and limit
async function fetchArt() {
  try {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&fields=artist_title,image_id,id,title&limit=${limit}`
    );
    const data = await response.json();

    const art = data.data;
    return art;
  } catch (error) {
    console.error('Error getting artists: ', error);
  }
}

// Calls fetchArt and sends data to buildArtInfoObject
async function handleArtByArtist() {
  const art = await fetchArt();
  const arts = art.slice(0, limit);
  buildArtInfoObject(arts);
}

// Builds an object for each piece of art and sends data to displayArt
function buildArtInfoObject(art) {
  art.forEach((art) => {
    if (art.artist_title && art.image_id) {
      const artInfo = {
        artist: art.artist_title,
        title: art.title,
        imageId: art.image_id,
        id: art.id,
      };
      artList.push(artInfo);
    }
  });
  if (artList.length > 0) {
    displayArt(artList);
  } else {
    alert(noArtToDisplayText);
  }
}

// Updates DOM to display each piece of art and clears artList array
function displayArt(list) {
  artContainer.innerHTML = '';
  galleryDescriptionContainer.textContent = displayArtDirectionsHTML;
  list.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('gallery__artwork__container');
    itemDiv.innerHTML = displayArtHTML(item);
    artContainer.appendChild(itemDiv);
  });
  artList = [];
}

// Event handlers
galleryForm.addEventListener('submit', handleGalleryFormSubmit);

function handleGalleryFormSubmit(e) {
  e.preventDefault();

  searchTerm = galleryFormInput.value;
  limit = limitFormInput.value;

  handleArtByArtist();
}
