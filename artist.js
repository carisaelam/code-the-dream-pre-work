// ARTIST SEARCH

const artContainer = document.querySelector('.art__container');
const artistTitle = document.querySelector('.artist__gallery__title');
const galleryForm = document.querySelector('.gallery__form');
let galleryFormInput = document.getElementById('gallery__form__input');

const limitForm = document.querySelector('.limit__form');
let limitFormInput = document.getElementById('limit__form__input');

let artList = [];
let searchTerm = '';
let limit = 10;
const IMAGE_CONFIG = 'https://www.artic.edu/iiif/2';

async function getArtByArtist() {
  try {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=${searchTerm}&fields=artist_title,image_id,id,title&limit=${limit}`
    );
    const data = await response.json();
    const { iiif_url: config } = data.config;

    const art = data.data;
    return art;
  } catch (error) {
    console.error('Error getting artists: ', error);
  }
}

async function handleArtByArtist() {
  const art = await getArtByArtist();
  const arts = art.slice(0, limit);
  buildArtInfoObject(arts);
}

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
  displayArt(artList);
  artList = [];
  console.log(artList);
}

function buildImageUrl(config, imageId) {
  return `${config}/${imageId}/${IMAGE_REQUEST_PARAMS}`;
}

function displayArt(list) {
  artContainer.innerHTML = '';
  list.forEach((item) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('artwork__container');
    itemDiv.innerHTML = `
      <div class="item__image__container"> 
        
        <a href="display.html?image_id=${item.imageId}&id=${item.id}">
          <img src="${IMAGE_CONFIG}/${item.imageId}/full/843,/0/default.jpg" alt="${item.title}" class="item__image" >
        </a>
      </div>
      <h3 class="item__title">${item.title}</h3>      
      <h3 class="item__artist">${item.artist}</h3>      

    `;
    artContainer.appendChild(itemDiv);
  });
  artList = [];
}

// Event listeners

galleryForm.addEventListener('submit', handleGalleryFormSubmit);

// Event handlers

function handleGalleryFormSubmit(e) {
  e.preventDefault();

  searchTerm = galleryFormInput.value;
  limit = limitFormInput.value;

  handleArtByArtist();
  searchTerm = '';
  galleryFormInput.value = '';
}
