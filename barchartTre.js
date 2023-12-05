//Barchart 1
// sætter dimensioner til visualiseringen
const margin3 = { top: 10, right: 30, bottom: 90, left: 60 };
const bredde3 = 600 - margin3.left - margin3.right;
const højde3 = 500 - margin3.top - margin3.bottom;

// appender svg objektet til body med select på id
const svg3 = d3
  .select("#barchart3")
  .append("svg")
  .attr("width", bredde3 + margin3.left + margin3.right)
  .attr("height", højde3 + margin3.top + margin3.bottom)
  .append("g")
  .attr("transform", `translate(${margin3.left},${margin3.top})`);

// dataset(data.data)
fetch("http://localhost:3000/barchart3")
  .then((response) => response.json())
  .then((result) => {
    const data = result.data; // tilgår data property

    // X akse
    const x = d3
      .scaleBand()
      .range([0, bredde3])
      .domain(data.map((d) => d.entity))
      .padding(0.2);
    svg3
      .append("g")
      .attr("transform", `translate(0,${højde})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y akse labels
    svg3
      .append("text")
      .attr("text-anchor", "center")
      .attr("y", -45)
      .attr("x", -250)
      .style("font-size", "20px")
      .attr("transform", "rotate(-90)")
      .text("Tons per year");

    // Y akse
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range([højde3, 0]);
    svg3.append("g").call(d3.axisLeft(y));

    //Når musen holdes over et land udføres
    let mouseOverBar = function (d) {
      // Tooltip
      const tooltip = svg3
        .append("text")
        .attr("class", "tooltip")
        .text(d.mismanaged)
        .attr("x", x(d.entity) + x.bandwidth() / 2)
        .attr("y", y(d.mismanaged) - 2)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "black");

      // Highlight på baren
      d3.select(this).style("opacity", 0.25).style("stroke", "black");
    };

    // Hgem value når mouseleave
    let mouseLeaveBar = function () {
      // fjern tooltip
      svg3.selectAll(".tooltip").remove();

      // Unhighlight  baren
      d3.select(this).style("opacity", 1).style("stroke", "none");
    };

    // color scale
    const colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.mismanaged)])
      .range(["#F2D6A2", "#D96E48"]); // Adjust the range of colors as needed

    // Bars
    svg3
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.entity))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => colorScale(d.mismanaged))
      .attr("y", (d) => y(0))
      .attr("height", 0)
      .on("mouseover", mouseOverBar)
      .on("mouseleave", mouseLeaveBar);

    // Animation
    svg3
      .selectAll("rect")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.mismanaged))
      .attr("height", (d) => højde3 - y(d.mismanaged))
      .delay((d, i) => i * 100);
  })
  .catch((error) => console.error("Error fetching data:", error));
