var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    d3.csv("assets/data/data.csv").then(function(originaldata, err) {
    if (err) throw err;

    originaldata.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(originaldata, d => d.poverty) * 0.9,
            d3.max(originaldata, d => d.poverty) *1.1
        ])
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(originaldata, d => d.healthcare) * 0.9,
            d3.max(originaldata, d => d.healthcare) * 1.1])
        .range([height,0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .classed("x-axis",true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);
    
    chartGroup.selectAll("circle")
        .data(originaldata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("opacity", ".4");

    chartGroup.append("g")
        .selectAll("text")
        .data(originaldata)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .classed(".stateText", true)
        .attr("text-anchor","middle")
        .attr("font-size","8")
        .attr("fill","white")
        .style("font-weight","bold")
        .attr("alignment-baseline","central");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 50})`)
        .attr("text-anchor","middle")
        .attr("font-size","15px")
        .style("font-weight","bold")
        .text("In Poverty (%)");

    chartGroup.append("text")
        .attr("y", 0 - (margin.left - 50))
        .attr("x", 0 - (height / 2))
        .attr("transform","rotate(-90)")
        .attr("text-anchor","middle")
        .attr("font-size","15px")
        .style("font-weight","bold")
        .text("Lacks Healthcare (%)");

}).catch(function(error) {
  console.log(error);
});