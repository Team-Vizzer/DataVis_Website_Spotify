
// set the dimensions and margins of the graph
var margin_area = {top: 20, right: 40, bottom: 0, left: 30};
    // width_area = 1510 - margin_area.left - margin_area.right,
    // width_area = 900 - margin_area.left - margin_area.right,
    // height_area = 350 - margin_area.top - margin_area.bottom;

var areaContainer = document.getElementById("area-container");
var width_area = areaContainer.clientWidth - margin_area.left - margin_area.right;
var height_area = areaContainer.clientHeight - margin_area.top - margin_area.bottom;

console.log("area info", areaContainer ,width_area, height_area);
// var containerWidth = document.getElementById("area").offsetWidth;
// var containerHeight = document.getElementById("area").offsetHeight;

// var width_area = containerWidth - margin_area.left - margin_area.right;
// var height_area = containerHeight - margin_area.top - margin_area.bottom;

// append the svg object to the body of the page
var svgArea = d3.select("#area")
  .append("svg")
    .attr("width", width_area)
    .attr("height", height_area)
  .append("g")
    .attr("transform",
          "translate(" + margin_area.left + "," + margin_area.top + ")");


// Parse the Data
d3.csv("2.csv").then(function(data) {

  // List of groups = header of the csv files
  const keys = data.columns.slice(1)

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, width_area ]);
  svgArea.append("g")
    .attr("transform", "translate(0," + height_area*0.8 + ")")
    .call(d3.axisBottom(x).tickSize(-height_area*.7).tickValues([2000,2002,2004, 2006,2008, 2010,2012,2014,2016, 2018, 2020,2022]))
    .select(".domain").remove()
  // Customization
  svgArea.selectAll(".tick line").attr("stroke", "#dedede")

  // Add X axis label:
  svgArea.append("text")
      .attr("text-anchor", "end")
      .attr("x", width_area)
      .attr("y", height_area-30 )
      .text("Time (year)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-2500, 2000])
    .range([ height_area, 0 ]);

// Define your custom color array
  var customColors = ['#2B4561', '#8F904E', '#7B928F', '#A1CCD9', '#D7CDBB', '#E5CEC6', '#EBC1C0', '#C99E8E', '#B08166', '#502F15'];

// Create a scale using the custom color array
  var color = d3.scaleOrdinal()
    .domain(keys) // Assuming 'keys' is the array of unique categories/keys
    .range(customColors); // Use your custom color array as the range


  // color palette
  //var color = d3.scaleOrdinal()
  //  .domain(keys)
  //  .range(d3.schemeDark2);
  //var color = ['#2B4561', '#8F904E', '#7B928F', '#A1CCD9', '#D7CDBB', '#E5CEC6', '#EBC1C0', '#C99E8E', '#B08166', '#502F15'];

  //stack the data?
  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

  // create a tooltip
  var Tooltip = svgArea
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(event,d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(event,d,i) {
    // grp = keys[i]
    grp=d.key
    Tooltip.text(grp)
  }
  var mouseleave = function(event,d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
   }

  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  svgArea
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

})