d3.select("#dataCapita")
  .on("click", function () {
    d3.selectAll("polygon")
    .transition()
    .duration(1500)
    .attr("cx", 500)
    .attr("cy", 500)
    .attr("fill", "yellow")
    .attr("rx", 100)
    .attr("ry", 200)
})