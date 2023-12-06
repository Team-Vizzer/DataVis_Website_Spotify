// Generate random data for countries as an example
let sorted_res = []
let result = []
let pop_dict = []
maxRadius=100
padding=20
const bubbleHeight = 200
const bubbleWidth = 990


function generateBubble(genre) {
  d3.csv("dataset.csv").then(function(dataset) {
    genre_data = dataset.filter((obj) => obj.new_genre===genre)
    pop_dict = genre_data.reduce((acc, obj) => {
    let key = obj.artists;
    if (!acc[key]) {
        acc[key] = {artists: key, popularity: 0, count: 0 };
    }
    acc[key].popularity += +obj.popularity;
    acc[key].count++;
    return acc;
    }, {});
    result = Object.values(pop_dict).map((group) => ({
      artists: group.artists,
      popularity: group.popularity / group.count,
    }));
    sorted_res = result.sort((a, b) => (a.popularity > b.popularity) ? -1 : 1)
    drawBubble(genre)
  })
}


generateBubble(new_genre)


function drawBubble(genre) {
  const svgBubble = d3.select("#bubble");
  svgBubble.attr("width", bubbleWidth).attr("height", bubbleHeight)
  const newCircle = circleGenerator(maxRadius);
for (let index = 0; index < 30; index++) {
  
  max_value = d3.max(sorted_res, function(d) { return d.popularity; })

  const circle = newCircle(maxRadius/max_value*sorted_res[index]["popularity"]);
  if (circle === null) continue;

 let color_scheme = d3.rgb(fulColor)
 color_scheme.s = (30-index)/30 
 color_scheme.opacity = (30-index)/30 
 
 svgBubble.append("circle")
      .attr("cx", circle[0])
      .attr("cy", circle[1])
      .attr("r", 0)
      .attr("fill", color_scheme)
    .transition()
      .attr("r", circle[2])
 if (circle[2] < 40) continue;
 else{
  svgBubble.append("text")
  .attr("x", circle[0]) // Set the x position
  .attr("y", circle[1]) // Set the y position
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .text(sorted_res[index]["artists"]).transition()
 }

  // yield svg.node();
}}

function circleGenerator(maxRadius) {
  const quadtree = d3.quadtree().extent([[0, 0], [500, 200]]);
  return k => {
    let bestX, bestY, bestDistance = 0;

    for (var i = 0; i < k; ++i) {
      const x = Math.random() * bubbleWidth;
      const y = Math.random() * bubbleHeight;
      const rx1 = x - k * 2;
      const rx2 = x + k * 2;
      const ry1 = y - k * 2;
      const ry2 = y + k * 2;
      let distance = k;

      quadtree.visit((node, x1, y1, x2, y2) => {
        if (!node.length) {
          do {
            const [px, py, pr] = node.data;
            const dx = x - px;
            const dy = y - py;
            const d2 = dx * dx + dy * dy;
            const r2 = pr * pr;
            if (d2 < r2) return distance = 0, true; // within a circle
            const d = Math.sqrt(d2) - pr;
            if (d < distance) distance = d;
          } while (node = node.next);
        }
        return !distance || x1 > rx2 || x2 < rx1 || y1 > ry2 || y2 < ry1; // or outside search radius
      });

      if (distance > bestDistance) bestX = x, bestY = y, bestDistance = distance;
    }

    if (bestDistance <= padding) return null;
    const best = [bestX, bestY, bestDistance - padding];
    quadtree.add(best);
    return best;
  };
}
// const svgKey = d3.select("#colorKey");
// const keyWidth = 200;
// const keyHeight = 10;

// // Gradient for the key
// const gradient = svgKey.append("defs")
//     .append("linearGradient")
//     .attr("id", "gradient")
//     .attr("x1", "0%")
//     .attr("y1", "0%")
//     .attr("x2", "100%")
//     .attr("y2", "0%");

// gradient.append("stop")
//     .attr("offset", "0%")
//     .attr("stop-color", colorScale(0));

// gradient.append("stop")
//     .attr("offset", "100%")
//     .attr("stop-color", colorScale(1));

// // Draw the color key
// svgKey.append("rect")
//     .attr("x", 50)
//     .attr("y", 10)
//     .attr("width", keyWidth)
//     .attr("height", keyHeight)
//     .style("fill", "url(#gradient)");

// // Add labels for the key
// svgKey.append("text")
//     .attr("x", 50)
//     .attr("y", 40)
//     .attr("fill", "#000")
//     .text("Unpopular");
    

// svgKey.append("text")
//     .attr("x", 50 + keyWidth)
//     .attr("y", 40)
//     .attr("fill", "#000")
//     .attr("text-anchor", "end")
//     .text("Most Popular");