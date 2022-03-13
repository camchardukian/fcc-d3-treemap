document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    if (!response.ok) {
        const errorMessage = `An error has occured: ${response.status}`
        throw new Error(errorMessage)
    }
    const data = await response.json()

    const width = 1200;
    const height = 1200;

    const svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // @TODO -- fix the fill colors of treemap

    const root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .paddingTop(8)
        .paddingRight(4)
        .paddingInner(2)
        // Padding between each rectangle
        // .paddingOuter(6)
        // .padding(20)
        (root)

    // prepare a color scale
    const color = d3.scaleOrdinal()
        .domain(["Wii"])
        .range(["pink"])

    // And a opacity scale
    const opacity = d3.scaleLinear()
        .domain([10, 30])
        .range([.5, 1])

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("class", "tile")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function (d) { return color(d.parent.data.category) })
        .style("opacity", function (d) {
            console.log('d', d.data)
            return opacity(d.data.value)
        })

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
        .text(function (d) { return d.data.name })
        .attr("font-size", "8px")
        .attr("fill", "black")

    // and to add the text labels
    svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function (d) { return d.x0 + 5 })    // +10 to adjust position (more right)
        .attr("y", function (d) { return d.y0 + 35 })    // +20 to adjust position (lower)
        .text(function (d) { return d.data.value })
        .attr("font-size", "11px")
        .attr("fill", "gray")
})