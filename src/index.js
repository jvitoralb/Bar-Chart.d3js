import * as d3 from "https://cdn.skypack.dev/d3@7";


window.addEventListener('load', function() {
    fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
    .then(data => createChart(data.data))
});

function createChart(data) {
    const valueGDP = data.map(item => item[1]);
    const dateGDP = data.map(item => item[0]);
    const svgHeight = 400;
    const svgWidth = 800;
    const padding = 40

    const svg = d3.select('#chart-container')
    .append('svg')
    .attr('height', svgHeight + padding)
    .attr('width', svgWidth + padding * 2);


    function createScales() {
        const dateGDPByYear = dateGDP.map(item => new Date(item));
        const minX = d3.min(dateGDPByYear);
        const maxX = d3.max(dateGDPByYear);

        const xScale = d3.scaleTime()
        .domain([minX, maxX])
        .range([0, svgWidth]);
        
        const xAxis = d3.axisBottom(xScale);
        svg.append('g')
        .attr('transform', `translate(${padding}, ${svgHeight})`)
        .call(xAxis)
        .attr('id', 'x-axis');

        const maxY = d3.max(valueGDP);

        const yScale = d3.scaleLinear()
        .domain([0, maxY])
        .range([svgHeight, 0]);
        
        const yAxis = d3.axisLeft(yScale);
        svg.append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis)
        .attr('id', 'y-axis');

        function createBars() {
            const linearScale = d3.scaleLinear()
            .domain([0, maxY])
            .range([0, svgHeight]);

            const scaledGDP = valueGDP.map(item => linearScale(item));
            const dateByQs = dateGDP.map(item => {
                if (item.includes('-01-01')) {
                    return item.replace('-01-01', ' Q1');
                } else if (item.includes('-04-01')) {
                    return item.replace('-04-01', ' Q2');
                } else if (item.includes('-07-01')) {
                    return item.replace('-07-01', ' Q3');
                } else if (item.includes('-10-01')) {
                    return item.replace('-10-01', ' Q4');
                }
            });
            const barWidth = svgWidth / 275;

            const tooltip = d3.select('#chart-container')
            .append('div')
            .attr('id', 'tooltip')
            .style('opacity', 0);
    
            svg.selectAll('rect')
            .data(scaledGDP)
            .enter()
            .append('rect')
            .attr('data-date', (d, i) => dateGDP[i])
            .attr('data-gdp', (d, i) => valueGDP[i])

            .attr('x', (d, i) => xScale(dateGDPByYear[i]))
            .attr('y', (d) => svgHeight - d)
            .attr('width', barWidth)
            .attr('height', (d) => d)

            .attr('fill', 'rgb(30, 191, 255)')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('class', 'bar').on('mouseover', (e, d) => {
                let index = scaledGDP.findIndex(item => item === d);

                tooltip.style('opacity', 0.9)
                .attr('data-date', dateGDP[index])
                .html(`${dateByQs[index]}<br>U$${valueGDP[index]}B`)
                .style('left', `${index * barWidth + 30}px`)
                .style('top', `${svgHeight - 100}px`)
                .style('transform', 'translateX(-25px)');
            }).on('mouseout', () => {
                tooltip.style('opacity', 0);
            });
        }
        createBars();
    }
    createScales();
}

