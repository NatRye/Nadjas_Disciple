// sætter dimensioner til visualiseringen
const margin2 = { top: 10, right: 30, bottom: 90, left: 60 };
const bredde2 = 600 - margin2.left - margin2.right;
const højde2 = 500 - margin2.top - margin2.bottom;

// appender svg objektet til body med select på id
const svg2 = d3
  .select("#barchart2")
  .append("svg")
  .attr("width", bredde2 + margin2.left + margin2.right)
  .attr("height", højde2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", `translate(${margin2.left},${margin2.top})`);

// dataset(data.data)
fetch("http://localhost:3000/barchart2")
  .then((response) => response.json())
  .then((result) => {
    const data = result.data; // tilgår data property

    // X akse
    const x = d3
      .scaleBand()
      .range([0, bredde2])
      .domain(data.map((d) => d.entity))
      .padding(0.2);
    svg2
      .append("g")
      .attr("transform", "translate(0,400)")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y akse label
    svg2
      .append("text")
      .attr("text-anchor", "center")
      .attr("y", -46)
      .attr("x", -250)
      .style("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .text("Tons per year");

    // Y akse
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

      // Highlight på bar
      d3.select(this).style("opacity", 0.25).style("stroke", "black");
    };

    // Gem value når mouseleave
    let mouseLeaveBar = function () {
      // fjern tooltip
      svg2.selectAll(".tooltip").remove();

      // Unhighlight baren
      d3.select(this).style("opacity", 1).style("stroke", "none");
    };

    // color scale
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range(["#71B1D9", "#3E5A89"]); // justerer Range af farverne

    // Bars
    svg2
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.entity))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => colorScale(d.mismanaged))
      .attr("y", (d) => y(0)) // Starter fra bunden
      .attr("height", 0) // Højden starter på 0
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
