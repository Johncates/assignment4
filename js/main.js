// set the dimensions and margins of the graph
const margin = {top: 30, right: 10, bottom: 10, left: 0},
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("https://raw.githubusercontent.com/utk-sis/insc489-21Spring/main/assingment%204/winequality-red.csv").then( function(data) {

    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    let dimensions = Object.keys(data[0]).filter(function (d) {
        return d !== "density"
    })

    // For each dimension, I build a linear scale. I store all in a y object
    const y = {}
    for (i in dimensions) {
        name = dimensions[i]
        y[name] = d3.scaleLinear()
            .domain( d3.extent(data, function(d) { return +d[name]; }) )
            .range([height, 0])
    }

    // Build the X scale -> it find the best position for each Y axis
    x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
    }

    // Draw the lines
    svg
        .selectAll("myPath")
        .data(data)
        .join("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", "#a10332")
        .style("opacity", 0.5)

    // Draw the axis:
    svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; })
        .style("fill", "black")

})