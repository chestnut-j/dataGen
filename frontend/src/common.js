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
      left: '15%',
      right: '15%',
      bottom: '10%'
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
      }
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
      left: '20%',
      right: '15%',
      bottom: '10%'
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
      }
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
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    tooltip: {
    },
    grid: {
      left: '15%',
      right: '15%',
      bottom: '10%'
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
    },
    yAxis: {
    },
    series: [
      {
        type: 'bar',
        data: data,
        barWidth: '99.3%',
        label: {
            show: true,
            position: 'top'
        },
      },
    ]
  }
}

export const getBarOption = function(name, data) {
  return {
    title: {
      // top: '5%',
      // left: '5%',
      // text: name
    },
    tooltip: {
    },
    grid: {
      left: '15%',
      right: '15%',
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      data: Object.keys(data),
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
    title: {
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom',
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label:{
          // position: 'center',
          formatter: '{b}\n({c})'
        },
        left: '5%',
        right: '5%',
        bottom: '5%',
        top:'5%',
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
    },
    yAxis: {
      type:'value',
      // interval: 1,
      interval: 'function(value){ return Math.ceil(value.max); }'
    },
    series: [
      {
        type: 'bar',
        data: Object.values(data),
        emphasis: {
            itemStyle: {
                color: '#8DBCF4'
            },
        },
      },
    ]
  }
}

export const caseOptions = [
  {
    id: 1,
    title: 'd3 case 1',
    content:  `data = {
      "( (Length(50) Opt Length(80) Opt Length(100) Opt Length(150) )  And Column(8) )": {
        "cname": "String",
        "economy(mpg)": "Real And Range(9,48)",
        "cylinders": "Real And Range(3,8)",
        "displacement(cc)": "Range(60, 460)",
        "power(hp)": "Range(50,230)",
        "weight(lb)": "Range(1500,5200)",
        "0-60 mph(s)": "Real And Range(8,25)",
        "year": "Range(70,82)"
      }
    }
    
    visFunc= function (data, svgId, echartInstance, d3, echarts, visCharts) {
      keys = [
        "economy(mpg)",
        "cylinders",
        "displacement(cc)",
        "power(hp)",
        "weight(lb)",
        "0-60 mph(s)",
        "year"
      ]

      keyz = "economy(mpg)"
      margin = ({top: 20, right: 10, bottom: 20, left: 10})
      width = keys.length * 100

      height = 900

      y = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]))
      x = d3.scalePoint(keys, [margin.top, height - margin.bottom])
      z = d3.scaleSequential(y.get(keyz).domain(), t => d3.interpolateBrBG(1 - t))


      line = d3.line()
        .defined(([, value]) => value != null)
        .y(([key, value]) => y.get(key)(value))
        .x(([key]) => x(key))
      
      

      const svg = d3.select(svgId)
          .attr('height',height)
          .attr('width',width)
          .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
        .join("path")
          .attr("stroke", d => z(d[keyz]))
          .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
        .append("title")
          .text(d => d.name);

      svg.append("g")
        .selectAll("g")
        .data(keys)
        .join("g")
          .attr("transform", d => \`translate(\${x(d)},0)\`)
          .each(function(d) { d3.select(this).call(d3.axisLeft(y.get(d))); })
          .call(g => g.append("text")
            .attr("y", margin.left)
            .attr("x", -6)
            .attr("text-anchor", "start")
            .attr("fill", "currentColor")
            .text(d => d))
          .call(g => g.selectAll("text")
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke", "white"));
    }
    evaluationFunc = function(data, svgId, echartInstance, efficiencyTest){
      return efficiencyTest
    }`
  },
  {
    id: 2,
    title: 'd3 case 2',
    content:  `data = {
      "( (Length(50) Opt Length(20)) And Column(7) )": {
        "city_name": "GPT('city name') And Repeat(3) And Empty(2)",
        "species": "Frequency('Adelie',0.3,'Chinstrap',0.4,'Gentoo',0.3)",
        "culmen_length_mm": "Real And Range(30,60)",
        "culmen_depth_mm": "Real And Range(13,25)",
        "flipper_length_mm": "Range(150,250)",
        "body_mass_g": "Cluster(4) And Range(0,300)",
        "sex": "Frequency('MALE',0.6,'FEMALE',0.4)"
      }
    }
    
    visFunc= function (data, svgId, echartInstance, d3, echarts, visCharts) {
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
      
        const svg = d3.select(svgId)
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
    evaluationFunc = function(data, svgId, echartInstance, efficiencyTest){
      return efficiencyTest
    }`
  },
  {
    id: 3,
    title: 'echart case 1',
    content:  `data = {
  "( (Length(50) Opt Length(20)) And Column(8) )": {
    "AQIindex": "Range(0,300) And FreqIf('<100',0.8) And Empty(3)",
    "PM25": "Range(0,300) And FreqIf('<100',0.7)",
    "PM10": "Range(0,300) And (FreqIf('<100',0.6) Opt FreqIf('<100',0.2))",
    "CO": "Real And Range(0,6) And FreqIf('<2',0.8)",
    "NO2": "Range(0,150) And (Distribution('normal', 50,30) Opt Distribution('normal', 60,10))",
    "SO2": "Range(0,90) And (Distribution('normal', 25,15) Opt Distribution('normal', 50,20))",
    "rank": "Frequency('A', 0.2, 'B', 0.4, 'C', 0.2, 'D', 0.1, 'E', 0.1)",
    "city": "Frequency('Beijing', 0.3, 'Shanghai', 0.4, 'Guangzhou', 0.3)"
  }
}

visFunc= function (data, svgId, echartInstance, d3, echarts, visCharts) {
  var myChart = echartInstance;
  var option;

  const schema = [
    { name: 'AQIindex', index: 1, text: 'AQI' },
    { name: 'PM25', index: 2, text: 'PM 2.5' },
    { name: 'PM10', index: 3, text: 'PM 10' },
    { name: 'CO', index: 4, text: 'CO' },
    { name: 'NO2', index: 5, text: 'NO₂' },
    { name: 'SO2', index: 6, text: 'SO₂' },
    { name: 'rank', index: 7, text: 'rank' }
  ];

  var lineStyle = {
    width: 1,
    opacity: 0.5
  };

  const CATEGORY_DIM = 7;

  const rawData = data.map(v =>{
    return [v['AQIindex'], v['PM25'], v['PM10'], v['CO'], v['NO2'], v['SO2'], v['rank'], v['city']]
  })

  option = {
    backgroundColor: '#333',
    legend: {
      bottom: 30,
      data: ['Beijing', 'Shanghai', 'Guangzhou'],
      itemGap: 20,
      textStyle: {
        color: '#fff',
        fontSize: 14
      }
    },
    tooltip: {
      padding: 10,
      backgroundColor: '#222',
      borderColor: '#777',
      borderWidth: 1
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
    visualMap: {
      show: true,
      min: 0,
      max: 150,
      dimension: 2,
      inRange: {
        color: ['#d94e5d', '#eac736', '#50a3ba'].reverse()
        // colorAlpha: [0, 1]
      }
    },
    parallel: {
      left: '10%',
      right: '10%',
      bottom: 100,
      parallelAxisDefault: {
        type: 'value',
        name: 'AQI指数',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
          color: '#fff',
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#aaa'
          }
        },
        axisTick: {
          lineStyle: {
            color: '#777'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          color: '#fff'
        }
      }
    },
    series: [
      {
        name: 'Beijing',
        type: 'parallel',
        lineStyle: lineStyle,
        data: rawData.filter(v=>v[CATEGORY_DIM]==='Beijing')
      },
      {
        name: 'Shanghai',
        type: 'parallel',
        lineStyle: lineStyle,
        data: rawData.filter(v=>v[CATEGORY_DIM]==='Shanghai')
      },
      {
        name: 'Guangzhou',
        type: 'parallel',
        lineStyle: lineStyle,
        data: rawData.filter(v=>v[CATEGORY_DIM]==='Guangzhou')
      }
    ]
  };

  option && myChart.setOption(option);
  return myChart
}
evaluationFunc = function(data, svgId, echartInstance, efficiencyTest){
  // data density
  // return data.length

  // data demension
  // let keys = Object.keys(data)
  // return keys.length

  // Data overlap degree
  // let overlap = 0
  // let keys =  ['AQIindex', 'PM25', 'PM10', 'CO', 'NO2', 'SO2', 'rank']
  // let len = data.length
  // let dem = keys.length 
  // for(let i=0; i<len;i++){
  //   for(let j=0;j<len;j++){
  //     if(i!=j){
  //       for(let k=0; k<dem-1; k++){
  //         let key1 = keys[k]
  //         let key2 = keys[k+1]
  //         if(data[i][key1]===data[j][key1] &&data[i][key2]===data[j][key2]){
  //           overlap++
  //         }
  //       }
  //     }
  //   }
  // }
  // overlap = overlap/(dem-1)
  // overlap=overlap/(len*len)
  // return overlap

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

  // Data distribution
  // let keys =  ['AQIindex', 'PM25', 'PM10', 'CO', 'NO2', 'SO2', 'rank']
  // let dem = keys.length 
  // let sum = 0
  // for(let i=0;i<keys.length;i++){
  //   var yMax = echartInstance.getModel().getComponent('parallelAxis',i).axis.scale._extent[1];
  //   var yMin = echartInstance.getModel().getComponent('parallelAxis',i).axis.scale._extent[0];
  //   let colData = data.map(v=>v[keys[i]])
  //   let dataMax = Math.max(...colData)
  //   let dataMin = Math.min(...colData)
  //   let dataSub = dataMax-dataMin
  //   let axisSub = yMax-yMin
  //   if(!Number.isNaN(dataSub)){
  //     sum += Math.pow(dataSub - axisSub, 2)
  //   }
  // }
  // sum=sum/dem
  // return sum
  
  // return efficiencyTest
}`
  },
  {
    id: 4,
    title: 'echart case 2',
    content:  `data = {
  "( (Length(50) Opt Length(20)) And Column(8) )": {
    "AQIindex": "Range(0,300) And FreqIf('<100',0.8) And Empty(3)",
    "PM25": "Range(0,300) And FreqIf('<100',0.7)",
    "PM10": "Range(0,300) And FreqIf('<100',0.6)",
    "CO": "Real And Range(0,6) And FreqIf('<2',0.8)",
    "NO2": "Range(0,150) And Distribution('normal', 50,30)",
    "SO2": "Range(0,90) And Distribution('normal', 25,15)",
    "rank": "Frequency('A', 0.2, 'B', 0.4, 'C', 0.2, 'D', 0.1, 'E', 0.1)",
    "city": "Frequency('Beijing', 0.3, 'Shanghai', 0.4, 'Guangzhou', 0.3)"
  }
}

visFunc= function (data, svgId, echartInstance, d3, echarts, visCharts) {
  var myChart = echartInstance;
  var option;

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
evaluationFunc = function(data, svgId, echartInstance, efficiencyTest){
  return efficiencyTest
}`
  },
  {
    id: 5,
    title: 'visChart case 1',
    content:  `data = {
  "( Length(1)And Column(2) )": {
    "real": "Enum('22') Opt Enum('+22') Opt Enum('-22') Opt Enum('ppp') Opt Empty(1)",
    "simu": "Range(0,300)",
  }
}

visFunc= function (data, svgId, echartInstance, d3, echarts, visCharts) {

}
evaluationFunc = function(data, svgId, echartInstance, efficiencyTest){
  return efficiencyTest
}`
  },
  {
    id: 8,
    title: 'draft',
    content:  `data = [{
      "( (Length(20) Opt Length(35)) And Column(12) )": {
        "name": "Faker(name)",
        "gender": "Frequency('male', 0.6, 'female', 0.4)",
        "telephone": "Faker(phone_number) And Empty(2)",
        "height": "Range(155.0,200.0) And FreqIf('>180', 0.4) And Mean(170)",
        "weight": "Range(35.0,100.0) And Max(88.8) And Quantile(50,50)",
        "score": "Distribution('normal',80,15)",
        "doubleScore": "Correlation('score','linear',2) ",
        "comment": "Repeat('goodcomment',2)",
        "trend": "Trend('exponential',1.4)",
        "cluster": "Int And Cluster(4) And Range(0,300)"
      }
    }]
    
    visFunc= function (a, b) {
      console.log('args:', a, b)
    }
    evaluationFunc = function(svgId, echartInstance, data, efficiencyTest){
      return efficiencyTest
    }`
  },
]
export const gptCaseOptions = [
  {
    id: 1,
    title: 'gpt case 1',
    description: `generate a table satisfying following constraints: 
1. it has 10 rows 
2. it has 5 columns, "id","name", "gender", "score","p" 
3. column "id", range from 1 to 10, with 3 duplicate value
4. column "name" is random name 
5. column "gender" 50% are 0, 50% are 1 
6. column "score" is normal distribution,range from 0 to 100, with 1 empty value and 2 duplicate value`,
    jsCode:  `visFunc= function (svgId, data, d3) {
  console.log(data)
}`
  },
  {
    id: 2,
    title: 'gpt case 2',
    description: `generate a table satisfying following constraints: 
    1. it has 10 rows 
    2. it has 5 columns, "id","name", "gender", "score","p" 
    3. column "id", range from 1 to 10, with 3 duplicate value
    4. column "name" is random name 
    5. column "gender" 50% are 0, 50% are 1 
    6. column "score" is normal distribution,range from 0 to 100, with 1 empty value and 2 duplicate value`,
    jsCode:  `visFunc= function (svgId, data, d3) {
      keys = [
        "economy(mpg)",
        "cylinders",
        "displacement(cc)",
        "power(hp)",
        "weight(lb)",
        "0-60 mph(s)",
        "year"
      ]

      keyz = "economy(mpg)"
      margin = ({top: 20, right: 10, bottom: 20, left: 10})
      height = keys.length * 100

      width = 900

      x = new Map(Array.from(keys, key => [key, d3.scaleLinear(d3.extent(data, d => d[key]), [margin.left, width - margin.right])]))
      y = d3.scalePoint(keys, [margin.top, height - margin.bottom])
      z = d3.scaleSequential(x.get(keyz).domain(), t => d3.interpolateBrBG(1 - t))


      line = d3.line()
        .defined(([, value]) => value != null)
        .x(([key, value]) => x.get(key)(value))
        .y(([key]) => y(key))
      
      

      const svg = d3.select(svgId)
          .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
          .attr("fill", "none")
          .attr("stroke-width", 1.5)
          .attr("stroke-opacity", 0.4)
        .selectAll("path")
        .data(data.slice().sort((a, b) => d3.ascending(a[keyz], b[keyz])))
        .join("path")
          .attr("stroke", d => z(d[keyz]))
          .attr("d", d => line(d3.cross(keys, [d], (key, d) => [key, d[key]])))
        .append("title")
          .text(d => d.name);

      svg.append("g")
        .selectAll("g")
        .data(keys)
        .join("g")
          .attr("transform", d => \`translate(0,\${y(d)})\`)
          .each(function(d) { d3.select(this).call(d3.axisBottom(x.get(d))); })
          .call(g => g.append("text")
            .attr("x", margin.left)
            .attr("y", -6)
            .attr("text-anchor", "start")
            .attr("fill", "currentColor")
            .text(d => d))
          .call(g => g.selectAll("text")
            .clone(true).lower()
            .attr("fill", "none")
            .attr("stroke-width", 5)
            .attr("stroke-linejoin", "round")
            .attr("stroke", "white"));
    }`
  },
  {
    id: 3,
    title: 'gpt case 3',
    jsCode:  `visFunc= function (svgId, data, d3) {
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
      
        const svg = d3.select(svgId)
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
    }`
  }
]