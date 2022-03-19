document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`
        throw new Error(errorMessage)
    }
    const data = await response.json();
    const valuesArray = data.children.map((platform) => platform.children.map((game) => Number(game.value))).flat()
    const videoGamePlatforms = data.children.map((platform) => platform.name).sort()
    const colorsArray = ["green", "blue", "deeppink", "purple", "orange", "tomato", "aqua", "beige", "brown", "crimson", "cyan", "gold", "greenyellow", "violet", "navy", "sienna", "silver", "yellow"]

    const width = 1200;
    const height = 1200;
    const spaceForLegend = 100;
    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const root = d3.hierarchy(data).sum((d) => d.value)
    // Here the size of each leave is given in the 'value' field in input data
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height - spaceForLegend])
        // padding between each rectangle
        .paddingTop(8)
        .paddingRight(4)
        .paddingInner(2)
        (root)

    // prepare a color scale
    const color = d3.scaleOrdinal()
        .domain(videoGamePlatforms)
        .range(colorsArray)

    // Opacity scale which darkens items with higher values and lightens items with lower values.
    const opacity = d3.scaleLinear()
        .domain([d3.min(valuesArray), d3.max(valuesArray) / 2])
        .range([.15, .4])

    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("visibility", "hidden")

    // Add rectangles + tooltip
    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("class", "tile")
        .attr("data-category", (d) => d.data.category)
        .attr("data-name", (d) => d.data.name)
        .attr("data-value", (d) => d.data.value)
        .attr('x', (d) => d.x0)
        .attr('y', (d) => d.y0)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", (d) => color(d.parent.data.name))
        .style("opacity", (d) => opacity(d.data.value))
        .on("mousemove", (e) => {
            const itemData = e.target?.__data__
            const { name, category, value } = itemData.data
            tooltip
                .style('top', `${e.pageY - 25}px`)
                .style('left', `${e.pageX + 10}px`)
                .transition()
                .style("visibility", "visible")
                .text(`Game Title: ${name}
                Platform: ${category}
                Popularity Value: ${value}
                `)
                .attr("data-value", value);
        })
        .on("mouseout", () => tooltip.transition().style("visibility", "hidden"));

    // add game name text label
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", (d) => d.x0 + 5) // +10 to adjust position (more to the right)
        .attr("y", (d) => d.y0 + 20) // +20 to adjust position (lower)
        .text((d) => d.data.name)
        .attr("font-size", "8px")
        .attr("fill", "black")

    // add value text label
    svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", (d) => d.x0 + 5) // +10 to adjust position (more to the right)
        .attr("y", (d) => d.y0 + 35) // +20 to adjust position (lower)
        .text((d) => d.data.value)
        .attr("font-size", "11px")
        .attr("fill", "black")

    // legend
    const legend = d3.select("svg")
        .append("g")
        .attr("id", "legend-container")
        .append("g")
        .attr("id", "legend")

    const legendColors = d3.scaleOrdinal()
        .domain(videoGamePlatforms)
        .range(colorsArray);

    // Add one dot in the legend for each name.
    const size = 32
    legend.selectAll("mydots")
        .data(videoGamePlatforms)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("x", (d, i) => (width / 5) + i * (size + 10)) // (width / 5) is where the first dot appears. size + 10 is the distance between dots
        .attr("y", height - (spaceForLegend / 1.5))
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d) => legendColors(d))

    // Add one label in the legend for each name.
    legend.selectAll("mylabels")
        .data(videoGamePlatforms)
        .enter()
        .append("text")
        .attr("x", (d, i) => (width / 5) + i * (size + 10)) // (width / 5) is where the first dot appears. size + 10 is the distance between dots
        .attr("y", height - (spaceForLegend / 1.5))
        .attr("width", size)
        .style("fill", "black")
        .text((d) => d)
})