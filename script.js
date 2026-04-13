const margin = { top: 20, right: 30, bottom: 40, left: 60 };
const width = 940 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const palette = ["#3b82f6", "#f43f5e", "#f59e0b", "#10b981", "#a78bfa", "#6366f1"];

// --- WHITE HAT VISUALIZATION (8 LINES) ---
const whiteSvg = d3.select("#white-chart")
    .append("svg")
    .attr("viewBox", `0 0 940 400`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const fadoTypes = ["Abuse of Authority", "Force", "Discourtesy", "Offensive Language"];

d3.json("data/processed_allegations.json").then(data => {
    const x = d3.scaleLinear().domain(d3.extent(data, d => d.year)).range([0, width]);

    // Find max across all 8 keys
    const allKeys = [];
    fadoTypes.forEach(t => { allKeys.push(t + "_Sub"); allKeys.push(t + "_Dis"); });
    const yMax = d3.max(data, d => Math.max(...allKeys.map(k => d[k])));
    const y = d3.scaleLinear().domain([0, yMax * 1.1]).range([height, 0]);

    whiteSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).tickFormat(d3.format("d")));
    whiteSvg.append("g").call(d3.axisLeft(y).ticks(5));

    whiteSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .text("NUMBER OF COMPLAINTS");

    whiteSvg.append("text")
        .attr("y", height + margin.bottom - 5)
        .attr("x", width / 2)
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .text("YEAR");

    const line = d3.line().x(d => x(d.year)).y(d => y(d.value)).curve(d3.curveMonotoneX);

    fadoTypes.forEach((type, i) => {
        const color = palette[i];
        const group = d3.select("#white-legend").append("div").attr("class", "legend-group");
        group.append("div").style("font-size", "0.7rem").style("font-weight", "700").style("color", color).text(type);

        // Substantiated Line (Solid)
        const subData = data.map(d => ({ year: d.year, value: d[type + "_Sub"] || 0 }));
        const subClass = `w-line-${i}-sub`;
        whiteSvg.append("path")
            .datum(subData)
            .attr("class", `line ${subClass}`)
            .attr("d", line)
            .attr("stroke", color)
            .attr("opacity", 0.7);

        // Dismissed Line (Dashed)
        const disData = data.map(d => ({ year: d.year, value: d[type + "_Dis"] || 0 }));
        const disClass = `w-line-${i}-dis`;
        whiteSvg.append("path")
            .datum(disData)
            .attr("class", `line ${disClass}`)
            .attr("d", line)
            .attr("stroke", color)
            .attr("stroke-dasharray", "5,5")
            .attr("opacity", 0.7);

        // Legend Items
        const items = [
            { name: "Substantiated", class: subClass, dashed: false },
            { name: "Dismissed/Other", class: disClass, dashed: true }
        ];

        items.forEach(item => {
            group.append("div")
                .attr("class", "legend-item")
                .html(`<div class="legend-color ${item.dashed ? 'dashed' : ''}" style="border-color:${color}; background:${item.dashed ? 'none' : color}"></div><span class="legend-text">${item.name}</span>`)
                .on("mouseover", () => {
                    whiteSvg.selectAll(".line").attr("opacity", 0.1);
                    whiteSvg.select(`.${item.class}`).attr("opacity", 1).attr("stroke-width", 5);
                })
                .on("mouseout", () => {
                    whiteSvg.selectAll(".line").attr("opacity", 0.7).attr("stroke-width", 3);
                });
        });
    });
});

const blackPalette = ["#8B0000", "#D94444", "#FFFFFF"];

// --- BLACK HAT VISUALIZATION (BAR CHART) ---
const blackSvg = d3.select("#black-chart")
    .append("svg")
    .attr("viewBox", `0 0 940 400`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("data/race_complaints.json").then(data => {
    const x = d3.scaleBand().range([0, width]).domain(data.map(d => d.ethnicity)).padding(0.4);
    const y = d3.scaleLinear().domain([4500, d3.max(data, d => d.complaints) * 1.1]).range([height, 0]);

    blackSvg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
    blackSvg.append("g").call(d3.axisLeft(y).ticks(5));

    blackSvg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.ethnicity))
        .attr("y", d => y(d.complaints))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.complaints))
        .attr("fill", (d, i) => blackPalette[i % blackPalette.length])
        .attr("opacity", 0.8);

    blackSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .text("NUMBER OF COMPLAINTS");

    blackSvg.append("text")
        .attr("y", height + margin.bottom - 5)
        .attr("x", width / 2)
        .attr("class", "axis-label")
        .style("text-anchor", "middle")
        .text("RACE OF MOS");

});