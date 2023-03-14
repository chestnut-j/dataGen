// const colorPalette = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6','#ffe86e','#e5d8bd','#fddaec','#f2f2f2'] 浅色
const colorPalette = ['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e','#e6ab02','#a6761d','#666666','#f2f2f2']
// const colorPalette = ['#005f73','#0a9396','#94d2bd','#e9d8a6','#ee9b00','#ca6702','#bb3e03','#ae2012','#9b2226']
// const colorPalette1 = ['#33658a','#86bbd8','#2f4858','#f6ae2d','#f26419','#b75d69','#bdc4a7','#92b4a7','#9b2226']

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
  const margin = {top: 40, right: 40, bottom: 72, left: 100},
      width = 640 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(svgId)
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
      .attr("class", "axis")
      .attr("transform", `translate(0, ${height})`)
      .call(
        d3.axisBottom(x)
        .tickValues([0,...data.columns.slice(1)].filter((v,i)=>i%3===0))
        // .tickValues([0,...data.columns.slice(1)].filter((v,i)=>i))
        
      );

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0,1])
    // const y = d3.scaleLog()
    //   .domain([0.1,3100])
      .range([ height, 0 ])
    svg.append("g")
      .attr("class", "axis")
      .call(
        d3.axisLeft(y)
          // .tickValues([0.1, 1,10,100,1000])
          .tickFormat(i=>i)
          .tickValues([0,0.2,0.4,0.6,0.8,1])
          // .ticks(10)
      )
    
    let texts = svg.selectAll('.tick')
        .selectAll('text')
        .attr("font-size", '29px')
        .attr("font-family", "Microsoft YaHei")
        .attr("transform", 'translate(0, 5)')
      


    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.top+30)
        .attr("font-size", '29px')
        .attr("font-family", "Microsoft YaHei")
        .text("Growth Rate")
        // .text("Number of Leaf Nodes")
        // .text("Depth")


    // Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+30)
        .attr("x", -height/2)
        .attr("font-size", '29px')
        .attr("font-family", "Microsoft YaHei")
        // .text("Average Aspect Ratio");
        .text("Median Aspect Ratio");
        // .text("Running Time (ms)");


    // let lines = [{x1: 0, x2: 1.2, y1: 0.5, y2: 0.5},{x1: 1.06, x2: 1.06, y1: 0, y2: 1}]
    // svg.selectAll(".grid-line")
    //   .data(lines).enter()
    //   .append("line")
    //     .attr("x1", function(d){ return x(d.x1); })
    //     .attr("x2", function(d){ return x(d.x2); })
    //     .attr("y1", function(d){ return y(d.y1); })
    //     .attr("y2", function(d){ return y(d.y2); })
    //     .attr("stroke-width", 1)
    //     .style("stroke", "#f00")
    //     .style("stroke-dasharray", (10, 10));
  
    // color palette
    const color = d3.scaleOrdinal()
      .domain(keys)
      // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
      .range(colorPalette)

    // Draw the line
    svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){return color(d.key) })
        .attr("stroke-width", 2)
        .attr("d", function(d){
          console.log(d)
          return d3.line()
            .x(function(d) { return x(d.category); })
            // .y(function(d) { return y(Math.log10(+d.value)); })
            .y(function(d) { return y(+d.value); })
            (d.values)
        })


//     svg.selectAll("mylines")
//       .data(keys)
//       .enter()
//       .append("rect")
//         .attr("y", margin.left) //width是svg的宽度，x属性用来调整位置
//         // .attr("x", (width / 160) * 157)  
//         //或者可以用width的分数来表示，更稳定一些，这是我试出来的，下面同
//         .attr("x", function(d,i){ return 71 + i*200})
//         .attr("width", 24)
//         .attr("height", 24) //设低一些就是线，高一些就是面，很好理解
//         .style("fill", function(d){ return color(d)})

//     // Add one dot in the legend for each name.
//     svg.selectAll("mylabels")
//       .data(keys)
//       .enter()
//       .append("text")
//         .attr("y", margin.left+12)
//         .attr("x", function(d,i){ return 100 + i*200}) // 100 is where the first dot appears. 25 is the distance between dots
//         .style("fill", function(d){ return color(d)})
//         .text(function(d){ return d})
//         .attr("text-anchor", "left")
//         .style("font-size", "24px")
//         .style("alignment-baseline", "middle")
                  
  })
}

function onDownload(data, type, name) {
  const blob = new Blob([data], { type }); // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
  const url = window.URL.createObjectURL(blob); //创建一个url
  const link = document.createElement('a'); //创建一个a标签
  link.href = url; // 把url 赋值给a标签的href
  link.style.display = 'none';
  link.setAttribute('download', name);
  document.body.appendChild(link);

  link.click(); // 触发a标签的点击事件
  URL.revokeObjectURL(url); // 清除Url
  document.body.removeChild(link);
}

function onSaveSvg() { // 保存svg
  const svg = document.querySelector('svg');
  const source = new XMLSerializer().serializeToString(svg); //将整个SVG document 对象序列化为一个 XML 字符串。
  onDownload(source, 'text/xml', 'test.svg'); // 下载 
}

function drawTree(svgId, dataPath) {
  // set the dimensions and margins of the graph
  const margin = {top: 40, right: 40, bottom: 60, left: 180},
      width = 640 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(svgId)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  let tree = d3.tree()
    // .size([width,height])
  d3.csv(dataPath, function(data) {
    var root = d3.stratify()
            .id(function(d) { return d.name; })
            .parentId(function(d) { return d.parent; })
            (data);
    console.log(root)
    root.sort((a, b) => a.id>b.id?1:-1);
    const dx = 14;
  const dy = width / (root.height+3);
  tree.nodeSize([dx, dy])(root);
    let nodes = root.descendants()
    let links = root.links()
    console.log(nodes,links)

    let link= svg.selectAll('.link')
                .data(links)
                .enter()
                .append('path')
                .attr('class','link')
                .attr("fill", "none")
                .attr("stroke", "#666666")
                .attr("stroke-width", 1)
                .attr('d', d3.linkHorizontal()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; }));
                

    let node = svg.selectAll('.node')
                .data(nodes)
                .enter()
                .append('g')
                .attr('class','node')
                .attr('transform', function(d){
                  return "translate("+d.x+","+d.y+")";
                })
    let color = ['#333333','#444444','#555555','#666666','#777777']
    node.append('circle')
        .attr('r',function(d){
          return ['root','L1','L2','L3'].includes(d.id)?6:5})
        .attr("fill",function(d){
          console.log(d)
          return color[d.depth]})

    node.append("text")
        .attr("dx", function(d){return d.children?-15:15})
        .attr("dy",10)
        .style("text-anchor",function(d){return d.children?"end":"start"})
        .attr('class','text')
        .attr('transform',"translate(15,-20)")
        .text(function(d){
          return ['root','L1','L2','L3'].includes(d.id)?d.id:''})
  })
  // let tree = d3.tree()
  //   .size([width,height-200])
  
  //   let diagonal = d3.diagonal()
  //                 .projection(d=>[d.y,d.x])
  // d3.json(dataPath, function(error,root){
  //   let nodes = tree.nodes(root)
  //   let links = tree.links(nodes)

  //   let link= svg.selectAll('.link')
  //               .data(links)
  //               .enter()
  //               .append('path')
  //               .attr('claa','link')
  //               .attr('d',diagonal)

  //   let node = svg.selectAll('.node')
  //               .data(nodes)
  //               .enter()
  //               .append('g')
  //               .attr('class','node')
  //               .attr('transform', function(d){
  //                 return "translate("+d.y+","+d.x+")";
  //               })

  //   node.append('circle')
  //       .attr('r',4.5)

  //   node.append("text")
  //       .attr("dx", function(d){return d.children?-15:15})
  //       .attr("dy",10)
  //       .style("text-anchor",function(d){return d.children?"end":"start"})
  //       .attr('class','text')
  //       .text(function(d){return d.name})
  // })

}
    

// drawLineChart('#plot','./data/acsAvg.csv')
// drawLineChart('#plot','./data/acsMedian.csv')
// drawLineChart('#plot','./data/desAvg.csv')
// drawLineChart('#plot','./data/desMedian.csv')
// drawLineChart('#plot','./data/randomAvg.csv')
// drawLineChart('#plot','./data/randomMedian.csv')
// drawLineChart('#plot','./data/depth.csv')
// drawLineChart('#plot','./data/scale.csv')
drawTree('#plot','./data/depth-3.csv')