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

export const getLineOption = function() {
  return {}
}

export const getHistogramOption = function() {
  return {}
}