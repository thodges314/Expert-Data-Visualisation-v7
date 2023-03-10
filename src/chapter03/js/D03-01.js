const show = () => {
  // DEFINITIONS /////////////////////////////////
  // let loadedData;
  const margin = { top: 20, bottom: 20, right: 120, left: 100 };
  const width = 1200 - margin.left - margin.right;
  const height = 800 - margin.top - margin.bottom;

  const chartG = d3
    .select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // MOVEMENT TOOLS //////////////////////////////
  const zoomed = (e) => chartG.attr("transform", e.transform);
  const zoom = d3.zoom().scaleExtent([0.1, 10]).on("zoom", zoomed);
  d3.select(".chart").call(zoom);

  // DRAWING TOOLS ////////////////////////////////
  const diagonal = (d) =>
    `M${d.y},${d.x}C${(d.y + d.parent.y) / 2},${d.x} ${
      (d.y + d.parent.y) / 2
    },${d.parent.x} ${d.parent.y},${d.parent.x}`;

  // LOAD DATA /////////////////////////////////
  d3.csv("./data/cats.csv").then((data) => {
    const rootData = d3.stratify()(data);
    // console.log(rootData);
    const treeGen = d3
      .tree()
      .size([height * 3, width])
      .separation((a, b) => (a.parent === b.parent ? 5 : 13));

    treeGen(rootData);

    // make links
    chartG
      .selectAll(".link")
      .data(rootData.descendants().slice(1))
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", diagonal);

    //make nodes
    const nodeG = chartG
      .selectAll(".node")
      .data(rootData.descendants())
      .enter()
      .append("g")
      .attr(
        "class",
        (d) => `node ${d.children ? "node--internal" : "node--leaf"}`
      )
      .attr("transform", (d) => `translate(${d.y}, ${d.x})`);

    nodeG.append("circle").attr("r", 2.5);

    nodeG
      .append("text")
      .attr("dy", ".35em")
      .attr("x", (d) => (d.children ? -4 : 4))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
  });
};
