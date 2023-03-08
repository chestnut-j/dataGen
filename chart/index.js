const colorPalette = ['#005f73','#0a9396','#94d2bd','#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
const colorPalette1 = ['#33658a','#86bbd8','#2f4858','#f6ae2d','#f26419','#b75d69','#bdc4a7','#92b4a7','#9b2226']

//Read the data
const parse = function(v){
  const keys = Object.keys(v)
  let format = []
  for(let key of keys){
    if(key!=='algorithm'){
      format.push({'category': key,'value':v[key]})
    }
  }
  return format
}

const drawLineChart = function(svgId, dataPath) {
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 500, bottom: 40, left: 60},
      width = 960 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(svgId)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


  d3.csv(dataPath, function(data) {
    console.log(data)
    console.log(data.map(d=>d.algorithm))
    const sumstat = data.map(v=>{
      return {
        key: v.algorithm,
        values: parse(v)
      }
    })
    const keys = data.map(d=>d.algorithm)
    console.log(sumstat)
    const x = d3.scalePoint()
            .domain([0,...data.columns.slice(1)])
            .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([-1, 5])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width/2+margin.left)
        .attr("y", height + margin.top + 30)
        .text("X axis title");

    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", +margin.bottom-height/2+margin.top)
        .text("Y axis title")

  
    // color palette
    const color = d3.scaleOrdinal()
      .domain(keys)
      // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
      .range(colorPalette1)

    // Draw the line
    svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){return color(d.key) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          console.log(d)
          return d3.line()
            .x(function(d) { return x(d.category); })
            .y(function(d) { return y(Math.log10(+d.value)); })
            (d.values)
        })

    svg.selectAll("mylines")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", width+margin.left) //width是svg的宽度，x属性用来调整位置
        // .attr("x", (width / 160) * 157)  
        //或者可以用width的分数来表示，更稳定一些，这是我试出来的，下面同
        .attr("y", function(d,i){ return 80 + i*25})
        .attr("width", 30)
        .attr("height", 2) //设低一些就是线，高一些就是面，很好理解
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", margin.left+width+40)
        .attr("y", function(d,i){ return 80 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("font-size", "12px")
        .style("alignment-baseline", "middle")
                  
  })
}

drawLineChart('#plot','./data/scale.csv')
// drawLineChart('#plot1','./data/expAvg1.csv')