    // set the dimensions and margin_ts of the graph
    // const margin_t = {top: 15, right: 20, bottom: 25, left: 70},
    //     width_t = 550 - margin_t.left - margin_t.right,
    //     height_t = 350 - margin_t.top - margin_t.bottom;
        // width_t = 500,
        // height_t =300;
    
    // append the svg object to the body of the page
    
    var margin_t = {top: 15, right: 20, bottom: 25, left: 70},
        tsneContainer = document.getElementById("tsne-container"),
        width_t = tsneContainer.offsetWidth - margin_t.left - margin_t.right,
        height_t = tsneContainer.offsetHeight - margin_t.top - margin_t.bottom;


    const svgT = d3.select("#tsne")
      .append("svg")
        .attr("width", width_t + margin_t.left + margin_t.right)
        .attr("height", height_t + margin_t.top + margin_t.bottom)
      .append("g")
        .attr("transform", `translate(${margin_t.left},${margin_t.top})`);
    
    //Read the data
    d3.csv("./new_dataset.csv").then( function(data) {
    
        // Add X axis
        const x = d3.scaleLinear()
            .domain([-0.05, 0.05])
            .range([ 0, width_t ]);
        svgT.append("g")
            .attr("transform", `translate(0, ${height_t})`)
            .call(d3.axisBottom(x));
        
        // Add Y axis
        const y = d3.scaleLinear()
            .domain([-0.035, 0.015])
            .range([ height_t, 0]);
        svgT.append("g")
            .call(d3.axisLeft(y));
        
        // Add a scale for bubble size
        const z = d3.scaleLinear()
            .domain([50, 4000])
            .range([3, 60]);
        
        const colorCodes = ['#2B4561', '#8F904E', '#7B928F', '#A1CCD9', '#D7CDBB', '#E5CEC6', '#EBC1C0', '#C99E8E', '#B08166', '#502F15'];
        // Add a scale for bubble color
        var myColor = d3.scaleOrdinal()
            .domain(['world-music', 'electronic', 'rock', 'metal', 'j-pop', 'kids', 'honky-tonk', 'indie', 'soundtracks', 'reggae'])
            .range(colorCodes);

        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            
        const showTooltip = function(event, d) {
            // const [x, y] = d3.pointer(event);
            tooltip
            .transition()
            .duration(200)
            tooltip
            .style("opacity", 0.6)
            .html(d.new_genre +': '+ d.radius)
            .style("left", (event.x) + "px")
            .style("top", (event.y)/2+40 + "px")
        }
        const moveTooltip = function(event, d) {
            // const [x, y] = d3.pointer(event);
            tooltip
            .style("left", (event.x) + "px")
            .style("top", (event.y)/2+40 + "px")
        }
        const hideTooltip = function(event, d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
        }
        
        // Add dots
        svgT.append('g')
            .selectAll("dot")
            .data(data)
            .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.mean_pca1))
            .attr("cy", d => y(d.mean_pca2))
            .attr("r", d => z(d.radius))
            //   .style("fill", "#69b3a2")
            .style("opacity", "0.9")
            //   .attr("stroke", "black")
            .style("fill", d => myColor(d.new_genre))
            // -3- Trigger the functions
            .on("mouseover", showTooltip )
            .on("mousemove", moveTooltip )
            .on("mouseleave", hideTooltip )
        
    }).catch(function(error) {
        console.error("Error loading dataset:", error);
    });