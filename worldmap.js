// Svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map og projection
var path = d3.geoPath();
var projection = d3
  .geoMercator()
  .scale(150)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data map for hvert dataset
var dataMapToShow = []; //Map til at blive vist
var dataMap1 = d3.map(); //Map for datasæt 1
var dataMap2 = d3.map(); //Map for datasæt 2
var dataMap3 = d3.map(); //Map for datasæt 3

// Load external data and boot
d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ) //topo
  .defer(d3.json, "http://localhost:3000/datacapitA") //data1
  .defer(d3.json, "http://localhost:3000/dataocean") //data2
  .defer(d3.json, "http://localhost:3000/datatotal") //data3
  .await(ready);

// Funktion der filtrere Antarktis ud
function filterAntarctica(data) {
  return data.features.filter((d) => d.id !== "ATA");
}

//Funktion der viser landendes data i en div med id'et "country-info"
function showCountryData(country) {
  var infoBox = d3.select("#country-info");

  // Transistion der starter på infoboxen, som så derefter kører functionen med if statements der afgør hvilket datasæt der skal vises
  infoBox
    .transition()
    .duration(300)
    .style("opacity", 0)
    .on("end", function () {
      infoBox.html("<h2>" + country.properties.name + "</h2>");

      const dataValue = dataMapToShow.get(country.id) || "Data not available";
      let dataType = "";

      if (dataMapToShow === dataMap1) {
        dataType = "Mismanaged Plastic Waste Per Capita in Kg";
      } else if (dataMapToShow === dataMap2) {
        dataType = "Plastic Waste Emitted To The Ocean in Tons";
      } else if (dataMapToShow === dataMap3) {
        dataType = "Total Plastic Waste Mismanaged in Tons";
      }

      infoBox
        .append("p")
        .html(dataType + ': <span class="data-value">' + dataValue + "</span>");

      // Transistion er indpakket rundt om hele indholdet
      infoBox.transition().duration(300).style("opacity", 1);
    });
}

//Funktion der kaldes på når dataen loader ind
function ready(error, topo, data1, data2, data3) {
  // Filtrere Antarktis fra topo
  topo.features = filterAntarctica(topo);

  console.log(topo);
  console.log(data1); //data per capita (World Map)
  console.log(data2); //data emitted to the ocean (World Map)
  console.log(data3); //data mismanaged plastic waste (World Map)
  console.log(dataMapToShow);

  //kolonner i hvert dataset udvælges og knyttes til en variabel
  let showData1 = data1.data;
  showData1.forEach((element) => {
    dataMap1.set(element.code, +element.mismanaged);
  });

  let showData2 = data2.data;
  showData2.forEach((element) => {
    dataMap2.set(element.code, +element.mismanaged);
  });

  let showData3 = data3.data;
  showData3.forEach((element) => {
    dataMap3.set(element.code, +element.mismanaged);
  });

  //Når musen holdes over et land udfø
  let mouseOver = function (d) {
    d3.selectAll(".Country").transition().duration(0).style("opacity", 0.5);
    d3.select(this)
      .transition()
      .duration(0)
      .style("opacity", 1)
      .style("stroke", "black");
  };

  //Dette sker når musen forlader et land
  let mouseLeave = function (d) {
    d3.selectAll(".Country").transition().duration(0).style("opacity", 0.8);
    d3.select(this).transition().duration(0).style("stroke", "black");
  };

  // Event listeners til skifte datasæt med dataset buttons
  document.getElementById("dataCapita").addEventListener("click", function () {
    dataMapToShow = dataMap1;
    updateMap("dataCapita");
    var currentLegend = updateLegend("dataCapita");
  });

  document.getElementById("dataOcean").addEventListener("click", function () {
    dataMapToShow = dataMap2;
    updateMap("dataOcean");
    var currentLegend = updateLegend("dataOcean");
  });

  document.getElementById("dataTotal").addEventListener("click", function () {
    dataMapToShow = dataMap3;
    updateMap("dataTotal");
    var currentLegend = updateLegend("dataTotal");
  });

  // Function to update the map based on the selected dataset
  function updateMap(id) {
    svg
      .selectAll("path")
      .data(topo.features)
      .transition()
      .duration(1000)
      .attr("fill", function (d) {
        var currentColorScale = updateColor(id);
        d.total = dataMapToShow.get(d.id) || 0;

        // Check if data is available and set default color for countries with no data
        if (d.total === 0) {
          return "gray";
        } else {
          return currentColorScale(d.total);
        }
      });
  }

  // Funktion der finder en farveskala baseret på valgt dataset
  function updateColor(id) {
    if (id === "dataCapita") {
      return colorScale1;
    } else if (id === "dataOcean") {
      return colorScale2;
    } else if (id === "dataTotal") {
      return colorScale3;
    } else {
      return colorScale1; // Default
    }
  }

  // Function to update the legend based on the selected dataset
  function updateLegend(id) {
    // Remove the existing legend
    svg.selectAll(".legend").remove();

    // Define legend elements dynamically based on the selected dataset
    var currentLegend;
    if (id === "dataCapita") {
      currentLegend = {
        x: 50,
        y: [80, 100, 120, 140, 160, 180],
        fill: ["grey", "#FFFFEA", "#F2D6A2", "#F2A25C", "#D96E48", "#8C5642"],
        text: [
          "No Data",
          "0 - 1 Kg.",
          "1 - 10 Kg.",
          "10 - 15 Kg.",
          "15 - 20 Kg.",
          "20 - 50 Kg.",
        ],
      };
    } else if (id === "dataOcean") {
      currentLegend = {
        x: 50,
        y: [80, 100, 120, 140, 160, 180],
        fill: ["grey", "#F8FCFF", "#B2D5E7", "#71B1D9", "#538DC5", "#3E5A89"],
        text: [
          "No Data",
          "0 - 10 Tons",
          "10 - 250 Tons",
          "250 - 1.000 Tons",
          "1.000 - 10.000 Tons",
          "10.000 - 50.000 Tons",
        ],
      };
    } else if (id === "dataTotal") {
      currentLegend = {
        x: 50,
        y: [80, 100, 120, 140, 160, 180],
        fill: ["grey", "#F2F2F2", "#FDA88F", "#F4665B", "#B94848", "#88393F"],
        text: [
          "No Data",
          "0 - 500 Tons",
          "500 - 50.000 Tons",
          "50.000 - 100.000 Tons",
          "100.000 - 1 mil Tons",
          "1 mil. - 3 mil. Tons",
        ],
      };
    } else {
      currentLegend = {}; // Default
    }

    // Loop through the legend data and create legend squares and text
    currentLegend.y.forEach((y, index) => {
      // Legend squares
      svg
        .append("rect")
        .transition()
        .duration(1000)
        .attr("x", currentLegend.x)
        .attr("y", y)
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", currentLegend.fill[index])
        .attr("class", "legend");

      // Legend text
      svg
        .append("text")
        .attr("x", currentLegend.x + 20)
        .attr("y", y + 10)
        .text(currentLegend.text[index])
        .style("font-size", "15px")
        .attr("alignment-baseline", "middle")
        .attr("class", "legend");
    });

    function updateLegend(id) {
      // Remove the existing legend
      svg.selectAll(".legend").remove();

      // Show/hide the legend based on the button click
      if (id === "dataCapita") {
        svg.selectAll(".legend").style("display", "block");
      } else if (id === "dataOcean") {
        svg.selectAll(".legend").style("display", "none");
      } else if (id === "dataTotal") {
        svg.selectAll(".legend").style("display", "none");
      } else {
        svg.selectAll(".legend").style("display", "none"); // Default
      }
    }
  }

  //Skaleringer af farve
  var colorScale1 = d3
    .scaleThreshold()
    .domain([1, 2, 5, 8, 10, 15, 20, 25, 35, 50])
    .range(d3.schemeYlOrBr[9]);

  var colorScale2 = d3
    .scaleThreshold()
    .domain([10, 50, 100, 250, 500, 1000, 5000, 10000, 20000, 50000])
    .range(d3.schemeBlues[9]);

  var colorScale3 = d3
    .scaleThreshold()
    .domain([
      500, 2000, 10000, 50000, 100000, 500000, 1000000, 1500000, 200000000,
    ])
    .range(d3.schemeReds[9]);

  // Draw the map
  svg
    .append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")

    // draw each country
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "black")
    .attr("class", function (d) {
      return "Country";
    })
    .style("opacity", 0.8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)

    // her køres den funktion vi lavede før, med at vise landene.
    .on("click", function (d) {
      showCountryData(d);
    });
}