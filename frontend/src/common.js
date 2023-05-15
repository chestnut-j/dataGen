const myColor = ['#cbd5e8','#fdcdac','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#b3e2cd']
export const getBoxOption = function(name, data){
  return {
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    dataset: [
      {
        source:[data]
      },
      {
        transform: {
          type: 'boxplot',
          config: {  }
        }
      },
      {
        fromDatasetIndex: 1,
        fromTransformResult: 1,
      }
    ],
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '25%',
      right: '5%',
      bottom: '10%',
      top:'15%'
    },
    xAxis: {
      type: 'category',
      // boundaryGap: true,
      // nameGap: 30,
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitArea: {
        show: true
      },
      scale: true
    },
    series: [
      {
        type: 'boxplot',
        datasetIndex: 1,
        tooltip: {//以下是设置tooltip的显示数据和显示格式
            formatter: function (param) {
                return [
                    'Max: ' + param.data[5],
                    'First Quartile: ' + param.data[4],
                    'Median: ' + param.data[3],
                    'Third Quartile: ' + param.data[2],
                    'Min: ' + param.data[1]
                ].join('<br/>');
            }
        }
      },
    ]
  }
}

export const getLineOption = function(name, data) {
  return {
    color: myColor,
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '25%',
      right: '5%',
      bottom: '10%',
      top:'15%'
    },
    xAxis: {
      type: 'category',
      // boundaryGap: true,
      // nameGap: 30,
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      splitArea: {
        show: true
      },
      scale: true
    },
    series: [
      {
        type: 'line',
        data: data,
        smooth: true,
      },
    ]
  }
}

export const getHistogramOption = function(name, data) {
  return {
    color: myColor,
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    tooltip: {
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '15%',
      top:'28%'
    },
    xAxis: {
      type: 'category',
      // boundaryGap: true,
      // nameGap: 30,
      scale: true,
      // splitArea: {
      //   show: false
      // },
      // splitLine: {
      //   show: false
      // }
      axisLabel:{
        fontSize: 16,
      }
    },
    yAxis: {
      name: 'frequency',
      nameTextStyle:{
        fontSize: 16,
      },
      axisLabel:{
        fontSize: 16,
      },
      splitNumber:4,
    },
    series: [
      {
        type: 'bar',
        data: data,
      },
      // {
      //   type: 'line',
      //   data: lineData,
      //   // barWidth: '99.3%',
      //   // label: {
      //   //     show: true,
      //   //     position: 'top'
      //   // },
      // },
    ]
  }
}

export const getBarOption = function(name, data ,showLabel=true) {
  return {
    color: myColor,
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    tooltip: {
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '15%',
      top:'28%'
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data),
      axisLabel:{
        show: showLabel,
        fontSize: 16,
      }
      // nameGap: 30,
      // scale: true,
      // splitArea: {
      //   show: false
      // },
      // splitLine: {
      //   show: false
      // }
    },
    yAxis: {
      type:'value',
      name: 'frequency',
      nameTextStyle:{
        fontSize: 16,
      },
      axisLabel:{
        fontSize: 16,
      },
      splitNumber:4,
    },
    series: [
      {
        type: 'bar',
        data: Object.values(data),
      },
    ]
  }
}

export const getPieOption = function(name, data) {
  return {
    color: myColor,
    title: {
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      show: false,
      orient: 'horizontal',
      bottom: 'bottom',
      textStyle: {
        fontSize: 15,
      }
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label:{
          position: 'inside',
          formatter: '{b}\n({c})',
          fontSize: 16,
          show: true,
        },
        labelLine:{
          show: false,
        },
        left: '-5%',
        right: '-5%',
        bottom: '-10%',
        top:'-5%',
      }
    ]
  }
}

export const getOverviewBarOption = function(name, data) {
  return {
    title: {
    },
    tooltip: {
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      top:'15%',
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data).map(v=>+v+1),
      axisLabel:{
        fontSize: 16,
      }
    },
    yAxis: {
      type:'value',
      // interval: 1,
      // interval: 'function(value){ return Math.ceil(value.max); }',
      splitNumber:3,
      axisLabel:{
        fontSize: 16,
      }
    },
    series: [
      {
        type: 'bar',
        data: data,
        emphasis: {
            itemStyle: {
                color: '#FB9620'
            },
        },
        tooltip:{
          formatter:(params)=>{
            let html = ` 
                        <pre style="font-size:16px;">${JSON.stringify(params.data.info,null,2)}</pre>
                        <span style="display:inline-block;margin-right:4px;
                          border-radius:10px;width:10px;height:10px;font-size:16px;
                          background-color:#8dbcf4;"></span>
                        <span>evaluation Index:  ${[params.data.value]}</span>
                        `
            return html
          },
          textStyle:{
            fontSize:16,
          },
          extraCssText: "z-index: 999999;",
          confine: true,
        }
      },
    ]
  }
}

export const caseOptions = [
  {
    id: 1,
    title: 'diffBar',
    content:  `{
  "table":"nRows(10) And nCols(2)",
  "columns": {
    "baseline": "Set(Random('uniform, min=0, max=20'),Random('categorical, categories=['+12','12','18','+18']'),String(),Empty(4))",
    "current": "Random('uniform, min=20, max=50')"
  }
}

visFunc= function (data, domId, d3, echarts, zCharts) {
  let chartDom = document.getElementById(domId)
  let instanceArr = []
  data.forEach((item, index) => {
    let grid = document.createElement('div')
    grid.id = \`\${domId}-grid-\${index}\`
    grid.style.width = 262 + 'px'
    grid.style.height = 240 + 'px'
    grid.style.display = 'inline-block'
    grid.style.marginLeft = 13+'px'
    chartDom.appendChild(grid)
    let itemData = Object.keys(item).map((k) => { return { type: k, value: item[k] } })
    let itemChart = new zCharts.DiffBarChart(\`\${domId}-grid-\${index}\`, {
      title: '',
      titleIsShow: false,
      size:[262,240],
      padding: [0,0,0,0],
      labelKey: 'type',
      valueKey: 'value',
      value: itemData,
      colors: ['#8c6bb1', '#e0e0e0'],
      xAxisFontSize: 16,
      yAxisFontSize: 16,
      labelFontSize: 16,
      tooltipFontSzie: 16,
      legendIsShow: false,
    });
    itemChart.$on('drag-bar', function(data){
      console.log(data)
    })
    instanceArr.push(itemChart)
  })

  let keys = ['diff','baseline','current']
  const color = d3.scaleOrdinal()
      .domain(keys)
      .range(['#E7E7E7','#BAACCF','#8D76B1'])
  let svg = d3.select("#"+domId)
    .append('svg')
    .attr("width", 400)
    .attr("height", 40)

  svg.selectAll("mycircles")
    .data(keys)
    .enter()
    .append("circle")
      .attr("cy", 10) 
      .attr("cx", function(d,i){ return i===2? 71 + i*110 : 71 + i*100})
      .attr("r", 5)
      .style("fill", function(d){ return color(d)})

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("y", 10)
      .attr("x", function(d,i){ return i===2? 80 + i*110 : 80 + i*100})
      .style("fill",'#222222')
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("font-size", "16px")
      .style("alignment-baseline", "middle")
  return instanceArr
}
evaluationFunc = function(data, domId, instance, efficiencyTest){
  let cnt = 0
  instance.forEach(item => {
    let data = item.realChart.chart.geometries[0].data
    data.forEach(el => {
      let v = el.value
      if (v === null || Number.isNaN(v) || !Number.isFinite(v)) {
        cnt++
      }
    })
  })
  return cnt
}`
  },
  {
    id: 2,
    title: 'heatMap',
    content:  `{
  "table":"Set(nRows(40000),nRows(36000),nRows(32000),nRows(28000),nRows(24000),nRows(20000),nRows(16000),nRows(12000),nRows(8000),nRows(4000)) And nCols(3)",
  "columns": {
    "x": "Random('normal, loc=120.13, scale=0.02')",
    "y": "Random('normal, loc=30.24, scale=0.01')",
    "value": "Random('categorical, categories=[1]')"
  }
}

visFunc = function (data, domId, d3, echarts, zCharts) {
  var myChart = echarts.init(document.getElementById(domId));
  option = { 
      animation: false,
      amap: {
        center: [120.13, 30.24],
        zoom:14,
        lang: "en"
      },
      visualMap: {
        show: false,
        top: 'top',
        min: 0,
        max: 5,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: ['#ffffcc', '#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026']
        }
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'amap',
          data: data.map(v=>Object.values(v)),
          pointSize: 5,
          blurSize: 6
        }
      ]
    }
  option && myChart.setOption(option);
  return myChart
}
evaluationFunc = function(ddata, domId, instance, efficiencyTest){
  return efficiencyTest
}`
  },
  {
    id: 3,
    title: 'd3 case',
    content:  `{
      "table":"Set(nRows(50), nRows(20)) And nCols(7)",
      "columns": {
        "city_name": "String() And Repeat(3)",
        "species": "Random('categorical, categories=['Adelie','Chinstrap','Gentoo'], weights=[0.3,0.4,0.3]')",
        "culmen_length_mm": "Real() And Range(30,60)",
        "culmen_depth_mm": "Real() And Range(13,25)",
        "flipper_length_mm": "Real() And Range(150,250)",
        "body_mass_g": "Real And Range(0,300)",
        "sex": "Random('categorical, categories=['MALE','FEMALE'], weights=[0.6,0.4]')"
      }
    }
    
    visFunc= function (data, domId, d3, echarts, zCharts) {
      function ScatterplotMatrix(data, {
        columns = data.columns, // array of column names, or accessor functions
        x = columns, // array of x-accessors
        y = columns, // array of y-accessors
        z = () => 1, // given d in data, returns the (categorical) z-value
        padding = 20, // separation between adjacent cells, in pixels
        marginTop = 10, // top margin, in pixels
        marginRight = 20, // right margin, in pixels
        marginBottom = 30, // bottom margin, in pixels
        marginLeft = 40, // left margin, in pixels
        width = 500, // outer width, in pixels
        height = width, // outer height, in pixels
        xType = d3.scaleLinear, // the x-scale type
        yType = d3.scaleLinear, // the y-scale type
        zDomain, // array of z-values
        fillOpacity = 0.7, // opacity of the dots
        colors = d3.schemeCategory10, // array of colors for z
      } = {}) {
        // Compute values (and promote column names to accessors).
        const X = d3.map(x, x => d3.map(data, typeof x === "function" ? x : d => d[x]));
        const Y = d3.map(y, y => d3.map(data, typeof y === "function" ? y : d => d[y]));
        const Z = d3.map(data, z);
      
        // Compute default z-domain, and unique the z-domain.
        if (zDomain === undefined) zDomain = Z;
        zDomain = new d3.InternSet(zDomain);
      
        // Omit any data not present in the z-domain.
        const I = d3.range(Z.length).filter(i => zDomain.has(Z[i]));
      
        // Compute the inner dimensions of the cells.
        const cellWidth = (width - marginLeft - marginRight - (X.length - 1) * padding) / X.length;
        const cellHeight = (height - marginTop - marginBottom - (Y.length - 1) * padding) / Y.length;
      
        // Construct scales and axes.
        const xScales = X.map(X => xType(d3.extent(X), [0, cellWidth]));
        const yScales = Y.map(Y => yType(d3.extent(Y), [cellHeight, 0]));
        const zScale = d3.scaleOrdinal(zDomain, colors);
        const xAxis = d3.axisBottom().ticks(cellWidth / 50);
        const yAxis = d3.axisLeft().ticks(cellHeight / 35);
      
        const svg = d3.select('#'+domId)
            .append('svg')
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [-marginLeft, -marginTop, width, height])
              .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
      
        svg.append("g")
          .selectAll("g")
          .data(yScales)
          .join("g")
            .attr("transform", (d, i) => \`translate(0,\${i * (cellHeight + padding)})\`)
            .each(function(yScale) { return d3.select(this).call(yAxis.scale(yScale)); })
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - marginLeft - marginRight)
                .attr("stroke-opacity", 0.1));
      
        svg.append("g")
          .selectAll("g")
          .data(xScales)
          .join("g")
            .attr("transform", (d, i) => \`translate(\${i * (cellWidth + padding)},\${height - marginBottom - marginTop})\`)
            .each(function(xScale) { return d3.select(this).call(xAxis.scale(xScale)); })
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("y2", -height + marginTop + marginBottom)
                .attr("stroke-opacity", 0.1))
      
        const cell = svg.append("g")
          .selectAll("g")
          .data(d3.cross(d3.range(X.length), d3.range(Y.length)))
          .join("g")
            .attr("fill-opacity", fillOpacity)
            .attr("transform", ([i, j]) => \`translate(\${i * (cellWidth + padding)},\${j * (cellHeight + padding)})\`);
      
        cell.append("rect")
            .attr("fill", "none")
            .attr("stroke", "currentColor")
            .attr("width", cellWidth)
            .attr("height", cellHeight);
      
        cell.each(function([x, y]) {
          d3.select(this).selectAll("circle")
            .data(I.filter(i => !isNaN(X[x][i]) && !isNaN(Y[y][i])))
            .join("circle")
              .attr("r", 3.5)
              .attr("cx", i => xScales[x](X[x][i]))
              .attr("cy", i => yScales[y](Y[y][i]))
              .attr("fill", i => zScale(Z[i]));
        });
      
        // TODO Support labeling for asymmetric sploms?
        if (x === y) svg.append("g")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("font-weight", "bold")
          .selectAll("text")
          .data(x)
          .join("text")
            .attr("transform", (d, i) => \`translate(\${i * (cellWidth + padding)},\${i * (cellHeight + padding)})\`)
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("dy", ".71em")
            .text(d => d);
      
        return Object.assign(svg.node(), {scales: {color: zScale}});
      }
      chart = ScatterplotMatrix(data, {
        columns: [
          "culmen_length_mm",
          "culmen_depth_mm",
          "flipper_length_mm",
          "body_mass_g"
        ],
        z: d => d.species
      })
    }
    evaluationFunc = function(data, domId, instance, efficiencyTest){
      return efficiencyTest
    }`
  },
  {
    id: 4,
    title: 'echart case',
    content:  `{
  "table":"Set(nRows(20),nRows(50)) And nCols(8)",
  "columns": {
    "AQIindex": "Range(0,300) And FreqIf('<100',0.8)",
    "PM25": "Range(0,300) And FreqIf('<100',0.7)",
    "PM10": "Range(0,300) And FreqIf('<100',0.6)",
    "CO": "Real() And Range(0,6) And FreqIf('<2',0.8)",
    "NO2": "Set(Random('normal, loc=50, scale=30'),Random('normal, loc=60, scale=10'))",
    "SO2": "Set(Random('normal, loc=25, scale=15'),Random('normal, loc=60, scale=10'))",
    "rank": "Random('categorical, categories=['A','B','C','D','E'], weights=[0.2,0.4,0.2,0.1, 0.1]')",
    "city": "Random('categorical, categories=['Beijing','Shanghai','Guangzhou'], weights=[0.3,0.4,0.3]')"
  }
}

visFunc= function (data, domId, d3, echarts, zCharts) {
  var myChart = echarts.init(document.getElementById(domId));

  var option;

  const CATEGORY_DIM_COUNT = 6;
  const GAP = 2;
  const BASE_LEFT = 5;
  const BASE_TOP = 10;
  // const GRID_WIDTH = 220;
  // const GRID_HEIGHT = 220;
  const GRID_WIDTH = (100 - BASE_LEFT - GAP) / CATEGORY_DIM_COUNT - GAP;
  const GRID_HEIGHT = (100 - BASE_TOP - GAP) / CATEGORY_DIM_COUNT - GAP;
  const CATEGORY_DIM = 7;
  const SYMBOL_SIZE = 4;
  function retrieveScatterData(data, dimX, dimY) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
      let item = [data[i][dimX], data[i][dimY]];
      item[CATEGORY_DIM] = data[i][CATEGORY_DIM];
      result.push(item);
    }
    return result;
  }
  function generateGrids() {
    let index = 0;
    const grid = [];
    const xAxis = [];
    const yAxis = [];
    const series = [];
    for (let i = 0; i < CATEGORY_DIM_COUNT; i++) {
      for (let j = 0; j < CATEGORY_DIM_COUNT; j++) {
        if (CATEGORY_DIM_COUNT - i + j >= CATEGORY_DIM_COUNT) {
          continue;
        }
        grid.push({
          left: BASE_LEFT + i * (GRID_WIDTH + GAP) + '%',
          top: BASE_TOP + j * (GRID_HEIGHT + GAP) + '%',
          width: GRID_WIDTH + '%',
          height: GRID_HEIGHT + '%'
        });
        xAxis.push({
          splitNumber: 3,
          position: 'top',
          axisLine: {
            show: j === 0,
            onZero: false
          },
          axisTick: {
            show: j === 0,
            inside: true
          },
          axisLabel: {
            show: j === 0
          },
          type: 'value',
          gridIndex: index,
          scale: true
        });
        yAxis.push({
          splitNumber: 3,
          position: 'right',
          axisLine: {
            show: i === CATEGORY_DIM_COUNT - 1,
            onZero: false
          },
          axisTick: {
            show: i === CATEGORY_DIM_COUNT - 1,
            inside: true
          },
          axisLabel: {
            show: i === CATEGORY_DIM_COUNT - 1
          },
          type: 'value',
          gridIndex: index,
          scale: true
        });
        series.push({
          type: 'scatter',
          symbolSize: SYMBOL_SIZE,
          xAxisIndex: index,
          yAxisIndex: index,
          data: retrieveScatterData(rawData, i, j)
        });
        index++;
      }
    }
    return {
      grid,
      xAxis,
      yAxis,
      series
    };
  }

  // Schema:
  // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
  const schema = [
    { name: 'AQIindex', index: 1, text: 'AQI' },
    { name: 'PM25', index: 2, text: 'PM 2.5' },
    { name: 'PM10', index: 3, text: 'PM 10' },
    { name: 'CO', index: 4, text: 'CO' },
    { name: 'NO2', index: 5, text: 'NO₂' },
    { name: 'SO2', index: 6, text: 'SO₂' },
    { name: 'rank', index: 7, text: 'rank' }
  ];

  const rawData = data.map(v =>{
    return [v['AQIindex'], v['PM25'], v['PM10'], v['CO'], v['NO2'], v['SO2'], v['rank'], v['city']]
  })

  const gridOption = generateGrids();

  option = {
    animation: false,
    brush: {
      brushLink: 'all',
      xAxisIndex: gridOption.xAxis.map(function (_, idx) {
        return idx;
      }),
      yAxisIndex: gridOption.yAxis.map(function (_, idx) {
        return idx;
      }),
      inBrush: {
        opacity: 1
      }
    },
    visualMap: {
      type: 'piecewise',
      categories: ['Beijing', 'Shanghai', 'Guangzhou'],
      dimension: CATEGORY_DIM,
      orient: 'horizontal',
      top: 0,
      left: 'center',
      inRange: {
        color: ['#51689b', '#ce5c5c', '#fbc357']
      },
      outOfRange: {
        color: '#ddd'
      },
      seriesIndex: gridOption.series.map(function (_, idx) {
        return idx;
      })
    },
    tooltip: {
      trigger: 'item'
    },
    parallelAxis: [
      { dim: 0, name: schema[0].text },
      { dim: 1, name: schema[1].text },
      { dim: 2, name: schema[2].text },
      { dim: 3, name: schema[3].text },
      { dim: 4, name: schema[4].text },
      { dim: 5, name: schema[5].text },
      {
        dim: 6,
        name: schema[6].text,
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E', 'F']
      }
    ],
    parallel: {
      bottom: '5%',
      left: '2%',
      height: '30%',
      width: '55%',
      parallelAxisDefault: {
        type: 'value',
        name: 'AQI指数',
        nameLocation: 'end',
        nameGap: 20,
        splitNumber: 3,
        nameTextStyle: {
          fontSize: 14
        },
        axisLine: {
          lineStyle: {
            color: '#555'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#555'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#555'
        }
      }
    },
    xAxis: gridOption.xAxis,
    yAxis: gridOption.yAxis,
    grid: gridOption.grid,
    series: [
      {
        name: 'parallel',
        type: 'parallel',
        smooth: true,
        lineStyle: {
          width: 1,
          opacity: 0.3
        },
        data: rawData
      },
      ...gridOption.series
    ]
  };

  option && myChart.setOption(option);
}
evaluationFunc = function(data, domId, instance, efficiencyTest){
  // Data intersect degree
  let intersect = 0
  let keys =  ['AQIindex', 'PM25', 'PM10', 'CO', 'NO2', 'SO2', 'rank']
  let len = data.length
  let dem = keys.length 
  for(let i=0; i<len;i++){
    for(let j=0;j<len;j++){
      if(i!=j){
        for(let k=0; k<dem-1; k++){
          let key1 = keys[k]
          let key2 = keys[k+1]
          if(data[i][key1]===data[j][key1] || 
              data[i][key2]===data[j][key2] ||
              (data[i][key1]-data[j][key1])*(data[i][key2]===data[j][key2])<0
              ){
            intersect++
          }
        }
      }
    }
  }
  intersect = intersect/(dem-1)
  intersect=intersect/(len*len)
  return intersect
}`
  },
]