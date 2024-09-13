const ENDPOINT = 'https://api.artic.edu/api/v1/artworks';
const IMAGE_REQUEST_PARAMS = 'full/843,/0/default.jpg';

const id = 26314;
const fields = '?fields=title,id,image_id,artist_title,color';
const url = `${ENDPOINT}/${id}/${fields}`;

// Retrieves all art from API. Useful as a helper.
async function getAllArt() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

// Builds object representing a single image
async function buildImageInfo() {
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
