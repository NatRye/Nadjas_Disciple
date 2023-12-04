// set the dimensions and margins of the graph
const margin2 = { top: 10, right: 30, bottom: 90, left: 60 };
const bredde2 = 600 - margin2.left - margin2.right;
const højde2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3
  .select("#barchart2")
  .append("svg")
  .attr("width", bredde2 + margin2.left + margin2.right) // Increased width for text
  .attr("height", højde2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

// dataset(data.data)
fetch("http://localhost:3000/barchart2")
  .then((response) => response.json())
  .then((result) => {
    const data = result.data; // Access the data property

    svg2
      .append("text")
      .attr("x", bredde2 + margin2.right - 30) // Adjusted x position
      .attr("y", højde2 / 6) // Adjusted y position
      .attr("transform", "rotate(0)")
      .style("text-anchor", "start") // Changed text-anchor to "start"
      .style("font-size", "20px") // Changed font size
      .style(
        "font-family",
        "Roobert,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif"
      )
      .selectAll("tspan")
      .enter()
      .append("tspan")
      .attr("x", bredde2 + margin2.right - 30) // Same x position for each line
      .attr("dy", "1em") // Adjust vertical spacing between lines
      .text((d) => d);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, bredde2])
      .domain(data.map((d) => d.entity))
      .padding(0.2);
    svg2
      .append("g")
      .attr("transform", `translate(0,${højde2})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis label
    svg2
      .append("text")
      .attr("text-anchor", "center")
      .attr("y", -46)
      .attr("x", -250)
      .style("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .text("Tons per year");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range([højde2, 0]);
    svg2.append("g").call(d3.axisLeft(y));

    //Når musen holdes over et land udføres
    let mouseOverBar = function (d) {
      // Tooltip
      const tooltip = svg2
        .append("text")
        .attr("class", "tooltip")
        .text(d.mismanaged)
        .attr("x", x(d.entity) + x.bandwidth() / 2)
        .attr("y", y(d.mismanaged) - 2)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");

      // Highlight the bar
      d3.select(this).style("opacity", 0.25).style("stroke", "black");
    };

    // Hide value on mouseleave
    let mouseLeaveBar = function () {
      // Remove tooltip
      svg2.selectAll(".tooltip").remove();

      // Unhighlight the bar
      d3.select(this).style("opacity", 1).style("stroke", "none");
    };

    // Create a linear color scale
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range(["#71B1D9", "#3E5A89"]); // Adjust the range of colors as needed

    // Bars
    svg2
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.entity))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => colorScale(d.mismanaged))
      .attr("y", (d) => y(0)) // Start at the base
      .attr("height", 0) // Initially, the height is 0
      .on("mouseover", mouseOverBar)
      .on("mouseleave", mouseLeaveBar);

    // Animation
    svg2
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.mismanaged))
      .attr("height", (d) => højde - y(d.mismanaged))
      .delay((d, i) => i * 100);
  })
  .catch((error) => console.error("Error fetching data:", error));
