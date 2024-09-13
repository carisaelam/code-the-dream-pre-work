// Fetching API data
const endpoint = 'https://api.artic.edu/api/v1/artworks';
const id = 263154;
const fields = '?fields=title,id,image_id';
const url = `${endpoint}/${id}/${fields}`;
const image_request_params = 'full/843,/0/default.jpg';

async function getAllArt() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

async function getArtId() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    const data = await response.json();
    const image_id = data.data.image_id;
    const config = data.config.iiif_url;
    const image_url = `${config}/${image_id}/${image_request_params}`;
    return image_url;
  } catch (error) {
    console.error(error);
    return null;
  }
}

getArtId()
  .then((imageUrl) => {
    if (imageUrl) {
      const artContainer = document.querySelector('.art__container');

      artContainer.innerHTML = `<img src='${imageUrl}'>`;
    } else {
      console.error(`Invalid image URL.`);
    }
  })
  .catch((error) => {
    console.error(error);
  });
