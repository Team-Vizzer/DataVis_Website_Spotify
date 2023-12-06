// Set the dimensions and margins of the graph
var margin = {top: 130, right: 50, bottom: 30, left: 120}, // Increased top margin
    // width_ridge = 480 - margin.left - margin.right,
    // height_ridge = 400 - margin.top - margin.bottom;
    ridgeContainer = document.getElementById("ridge-container");
    width_ridge = ridgeContainer.offsetWidth - margin.left - margin.right;
    height_ridge = ridgeContainer.offsetHeight- margin.top - margin.bottom;

// Append the svg object to the body of the page
var svg = d3.select("#ridgeChart")
  .append("svg")
    .attr("width", width_ridge + margin.left + margin.right)
    .attr("height", height_ridge + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var categories = ['danceability', 'liveness_norm', 'tempo_norm', 'energy', 'valence', 'loudness_norm', 'speechiness_norm', 'acousticness_norm'];
var n = categories.length;
// var selectedGenre = "metal";

// Function to update the ridge plot
function updateRidgePlot(selectedYear, new_genre) {
    d3.csv("dataset.csv").then(function(data) {
        // Filter data by year and genre
        var filteredData = data.filter(function(d) {
            var year = d.release_date.split('/')[2];
            return d.new_genre === new_genre && year === selectedYear;
        });
        console.log("filteredData:",filteredData);

        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 1]) // Adjusted to match normalized data range
            .range([0, width_ridge]);
        svg.selectAll(".xAxis").remove(); // Remove previous axis
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height_ridge + ")")
            .call(d3.axisBottom(x).tickValues([0, 0.25, 0.5, 0.75, 1]).tickSize(-height_ridge))
            .selectAll("text")
            .attr("fill", "black")
            .select(".domain").remove();

        console.log("X Axis Added");

        // Create a Y scale for densities
        var y = d3.scaleLinear()
            .domain([0, 40])
            .range([0, height_ridge]); // Inverted range for bottom to top plotting

        // Create the Y axis for names
        var yName = d3.scaleBand()
            .domain(categories)
            .range([0, height_ridge])
            .paddingInner(1);
        svg.selectAll(".yAxis").remove(); // Remove previous axis
        svg.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(yName).tickSize(0))
            .selectAll("text")
            .attr("fill", "black")
            .select(".domain").remove();

        console.log("Y Axis Added");

        // Create a color scale
        var myColor = d3.scaleLinear()
        .domain([0, 100])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb(nonColor), d3.rgb(fulColor)])

        // Compute histograms for each category
        var histograms = categories.map(function(category) {
            var histogram = d3.histogram()
                .value(function(d) { return d[category]; })
                .domain(d3.extent(filteredData, function(d) { return d[category]; }))
                .thresholds(x.ticks(100)); // Adjust the number of bins

            return {
                category: category,
                bins: histogram(filteredData)
            };
        });

        console.log("histograms:",histograms);

        // Draw the histograms
        svg.selectAll(".bar").remove(); // Remove previous bars
        histograms.forEach(function(histogramData, i) {
            var category = histogramData.category;
            var bins = histogramData.bins;

            svg.selectAll(".bar-" + category)
                .data(bins)
                .enter().append("rect")
                .attr("class", "bar bar-" + category)
                .attr("x", function(d) { return x(d.x0); })
                .attr("y", function(d) { return yName(category) + yName.bandwidth() - y(d.length); }) // Adjust y position
                .attr("width", function(d) { return x(d.x1) - x(d.x0); }) // Adjust width to remove white space
                .attr("height", function(d) { return y(d.length); })
                .attr("fill", function(d) {
                    return myColor(i * 10);
                })
                .attr("opacity", 0.7);
        });

    }).catch(function(error) {
        console.log(error);
    });
}

// Initial plot
updateRidgePlot("2000", new_genre); // Default year and genre

// Event listener for the time slider
document.getElementById("yearSlider").addEventListener("input", function(event) {
    const selectedYear = event.target.value;
    document.getElementById("yearLabel").innerText = selectedYear;
    updateRidgePlot(selectedYear, "world-music"); // Update to the selected year
});