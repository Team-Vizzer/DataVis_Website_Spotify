// Example genre and color arrays
const genreNames = ['world-music', 'electronic', 'rock', 'metal', 'j-pop', 'kids', 'honky-tonk', 'indie', 'soundtracks', 'reggae'];
const colorNames = ['#2B4561', '#8F904E', '#7B928F', '#A1CCD9', '#D7CDBB', '#E5CEC6', '#EBC1C0', '#C99E8E', '#B08166', '#502F15'];
// Function to create the legend
function createLegend(genreNames, colorNames) {
  const legend = document.getElementById('genreLegend');

  genreNames.forEach((genre, index) => {
    // Create legend item
    const item = document.createElement('div');
    item.classList.add('legend-item');

    // Create color box
    const colorBox = document.createElement('span');
    colorBox.classList.add('color-box');
    colorBox.style.backgroundColor = colorNames[index];

    // Create genre label
    const label = document.createElement('span');
    label.classList.add('genre-label');
    label.textContent = genre;

    // Append color box and label to the item
    item.appendChild(colorBox);
    item.appendChild(label);

    // Append item to the legend
    legend.appendChild(item);
  });
}

// Call the function to create the legend
createLegend(genreNames, colorNames);
