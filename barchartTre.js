// bar chart 3

// set the dimensions and margins of the graph

// append the svg object to the body of the page
const svg3 = d3
  .select("#barchart3")
  .append("svg")
  .attr("width", bredde + margin.left + margin.right + 700) // Increased width for text
  .attr("height", højde + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// dataset(data.data)
fetch("http://localhost:3000/barchart3")
  .then((response) => response.json())
  .then((result) => {
    const data = result.data; // Access the data property

    descriptionText =
      "This bar chart visualizes the extent of plastic pollution\n on a per capita basis across different countries.\n The height of each bar represents\n the amount of mismanaged plastic waste,\n measured in kilograms, for each country's population.\n A higher bar indicates a higher level of plastic waste\n generated per person.\n\n\n The chart aims to highlight variations\n in the mismanagement of plastic waste,\n emphasizing the need for sustainable waste management \n practices to mitigate the environmental impact of plastic pollution.\n Explore the data to gain insights\n into the countries that face significant challenges in\n handling plastic waste on a per capita basis. ";

    svg3
      .append("text")
      .attr("x", bredde + margin.right) // Adjusted x position
      .attr("y", højde / 6) // Adjusted y position
      .attr("transform", "rotate(0)")
      .style("text-anchor", "start") // Changed text-anchor to "start"
      .style("font-size", "20px") // Changed font size
      .style(
        "font-family",
        "Roobert,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif"
      )
      .style("border", "px solid black") // Added border style
      .style("padding", "15px") // Added padding for better readability
      .selectAll("tspan")
      .data(descriptionText.split("\n"))
      .enter()
      .append("tspan")
      .attr("x", bredde + margin.right - 30) // Same x position for each line
      .attr("dy", "1em") // Adjust vertical spacing between lines
      .text((d) => d);

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, højde])
      .domain(data.map((d) => d.entity))
      .padding(0.2);
    svg3
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("transform", "translate(-10,0)")
      .style("text-anchor", "end");

    // X axis label
    svg3
      .append("text")
      .attr("text-anchor", "center")
      .attr("y", højde + margin.bottom - 20)
      .attr("x", bredde / 2)
      .style("font-size", "20px")
      .text("Ton. per year");

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range([0, bredde]);

    svg3
      .append("g")
      .attr("transform", `translate(0, ${højde})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    //Når musen holdes over et land udføres
    let mouseOverBar = function (d) {
      // Tooltip
      const tooltip = svg3
        .append("text")
        .attr("class", "tooltip")
        .text(d.mismanaged)
        .attr("x", x(d.entity) + y.bandwidth() / 2)
        .attr("y", y(d.mismanaged) - 2)
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");

      // Highlight the bar
      d3.select(this).style("opacity", 0.25).style("stroke", "black");
    };

    // Hide value on mouseleave
    let mouseLeaveBar = function () {
      // Remove tooltip
      svg3.selectAll(".tooltip").remove();

      // Unhighlight the bar
      d3.select(this).style("opacity", 1).style("stroke", "none");
    };

    // Create a linear color scale
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range(["orange", "red"]); // Adjust the range of colors as needed

    // Bars
    svg3
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.entity))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => colorScale(d.mismanaged))
      .attr("x", 0) // Start at the base
      .attr("width", (d) => x(d.mismanaged)) // Width based on the data
      .on("mouseover", mouseOverBar)
      .on("mouseleave", mouseLeaveBar);

    // Animation
    svg3
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("x", (d) => y(d.mismanaged))
      .attr("bredde", (d) => bredde - x(d.mismanaged))
      .delay((d, i) => i * 100);
  })
  .catch((error) => console.error("Error fetching data:", error));
