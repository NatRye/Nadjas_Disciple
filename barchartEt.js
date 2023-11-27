//Barchart 1
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 90, left: 60 },
  bredde = 600 - margin.left - margin.right,
  højde = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3
  .select("#barchart1")
  .append("svg")
  .attr("width", bredde + margin.left + margin.right + 700) // Increased width for text
  .attr("height", højde + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// dataset(data.data)
fetch("http://localhost:3000/barchart1")
  .then((response) => response.json())
  .then((result) => {
    const data = result.data; // Access the data property

    descriptionText =
      "This bar chart visualizes the extent of plastic pollution\n on a per capita basis across different countries.\n The height of each bar represents\n the amount of mismanaged plastic waste,\n measured in kilograms, for each country's population.\n A higher bar indicates a higher level of plastic waste\n generated per person.\n\n\n The chart aims to highlight variations\n in the mismanagement of plastic waste,\n emphasizing the need for sustainable waste management \n practices to mitigate the environmental impact of plastic pollution.\n Explore the data to gain insights\n into the countries that face significant challenges in\n handling plastic waste on a per capita basis. ";

    svg1
      .append("text")
      .attr("x", bredde + margin.right - 30) // Adjusted x position
      .attr("y", højde / 6) // Adjusted y position
      .attr("transform", "rotate(0)")
      .style("text-anchor", "start") // Changed text-anchor to "start"
      .style("font-size", "20px") // Changed font size
      .style(
        "font-family",
        "Roobert,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif"
      )
      .selectAll("tspan")
      .data(descriptionText.split("\n"))
      .enter()
      .append("tspan")
      .attr("x", bredde + margin.right - 30) // Same x position for each line
      .attr("dy", "1em") // Adjust vertical spacing between lines
      .text((d) => d);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, bredde])
      .domain(data.map((d) => d.entity))
      .padding(0.2);
    svg1
      .append("g")
      .attr("transform", `translate(0,${højde})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis label
    svg1
      .append("text")
      .attr("text-anchor", "center")
      .attr("y", -45)
      .attr("x", -250)
      .style("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .text("Kg. per year");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range([højde, 0]);
    svg1.append("g").call(d3.axisLeft(y));

    //Når musen holdes over et land udføres
    let mouseOverBar = function (d) {
      // Tooltip
      const tooltip = svg1
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
      svg1.selectAll(".tooltip").remove();

      // Unhighlight the bar
      d3.select(this).style("opacity", 1).style("stroke", "none");
    };

    // Create a linear color scale
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range(["orange", "red"]); // Adjust the range of colors as needed

    // Bars
    svg1
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
    svg1
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.mismanaged))
      .attr("height", (d) => højde - y(d.mismanaged))
      .delay((d, i) => i * 100);
  })
  .catch((error) => console.error("Error fetching data:", error));
