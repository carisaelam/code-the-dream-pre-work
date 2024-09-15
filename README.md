# Search Art Project

## Overview

Welcome to the Search Art Project! This web application allows users to explore artwork using data from the Art Institute of Chicago's public API. Users can search for art by keyword and specify the number of results (5, 10, 25, or 50). The search functionality is powered by Elasticsearch, which ranks results by relevance. If the search fails or returns no results, an alert prompts the user to try a different search.

The home page features a gallery of artwork displayed in card-like elements with images, titles, and artists. Clicking on a card takes the user to a detailed display page where more information about the piece is shown. This display view uses the image ID passed via URL parameters to query additional data from the API such as the description of the image and some data about the color of the image. The color data is used to dynamically create a matching background that complements the piece of art.

## Project Structure

- **`index.html`**: Main page displaying a gallery of artwork.
- **`display.html`**: Detailed view of each piece of art, accessible from the gallery.
- **`style.css`**: CSS file for styling the HTML pages.
- **`index.js` & `display.js`**: The JavaScript files that fetch data from the Art Institute of Chicago API and manages dynamic content.
- **`README.md`**: This file, providing instructions and project details.

## How to Run the Project

1. **Clone the Repository**

   ```bash
   git clone https://github.com/carisaelam/code-the-dream-pre-work.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd code-the-dream-pre-work
   ```

3. **Open the `index.html` file in your browser**
   - You can open this file in any web browser to view the gallery page.
   - Search for a term such as "cat", "Picasso", or "town." Click on an image in the gallery to navigate to the detailed view page for that piece of art.

## Navigation Between Pages

- **Gallery Page** (`index.html`): Displays a list of artworks. Clicking on an artwork thumbnail will navigate to the detailed view page (`display.html`).
- **Detailed View Page** (`display.html`): Shows more information about the selected artwork. Click on the "Home" button to return to the gallery page.

## Styling

- Mobile first, responsive design with a breakpoint for "landscape" view or larger devices
- The CSS styles are designed to ensure readability and a pleasing visual experience.
- The focus is on a clean design that allows the artwork itself to shine.
