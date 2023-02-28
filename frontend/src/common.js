export const getBoxOption = function(name, data){
  return {
    title: {
      top: '5%',
      left: '5%',
      text: name
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
        name: 'boxplot',
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
      top: '5%',
      left: '5%',
      text: name
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
        name: 'line',
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
      top: '5%',
      left: '5%',
      text: name
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
        name: 'histogram',
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
      top: '5%',
      left: '5%',
      text: name
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
        name: 'histogram',
        type: 'bar',
        data: Object.values(data),
      },
    ]
  }
}

export const caseOptions = [
  {
    id: 1,
    title: 'case 1',
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
    
    func= function (a, b) {
      console.log('args:', a, b)
    }`
  },
  {
    id: 2,
    title: 'case 2',
    content:  `data = [{
      "( (Length(50) Opt Length(80) )  And Column(8) )": {
        "cname": "String",
        "economy(mpg)": "Real And Range(9,48)",
        "cylinders": "Real And Range(3,8)",
        "displacement(cc)": "Range(60, 460)",
        "power(hp)": "Range(50,230)",
        "weight(lb)": "Range(1500,5200)",
        "0-60 mph(s)": "Real And Range(8,25)",
        "year": "Range(70,82)"
      }
    }]
    
    func= function (svgId, data, d3) {
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
    title: 'case 3',
    content:  `data = [{
      "( (Length(50) Opt Length(80)) And Column(6) )": {
        "city_name": "GPT('city name') And Repeat(3) And Empty(2)",
        "species": "Frequency('Adelie',0.3,'Chinstrap',0.4,'Gentoo',0.3)",
        "culmen_length_mm": "Real And Range(30,60)",
        "culmen_depth_mm": "Real And Range(13,25)",
        "flipper_length_mm": "Range(150,250)",
        "body_mass_g": "Cluster(4) And Range(0,300)",
        "sex": "Frequency('MALE',0.6,'FEMALE',0.4)"
      }
    }]
    
    func= function (svgId, data, d3) {
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