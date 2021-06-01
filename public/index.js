const data = [
  {
    'sum(客户编号)': 665,
    省: '云南省',
    市: '云南市1'
  }, {
    'sum(客户编号)': 665,
    省: '云南省',
    市: '云南市2'
  }, {
    'sum(客户编号)': 665,
    省: '云南省',
    市: '云南市3'
  },
  {
    'sum(客户编号)': 1665,
    省: '广东省',
    市: '广东市1'
  }, {
    'sum(客户编号)': 1665,
    省: '广东省',
    市: '广东市2'
  }, {
    'sum(客户编号)': 1665,
    省: '广东省',
    市: '广东市3'
  },
  {
    'sum(客户编号)': 3665,
    省: '广西省',
    市: '广西市1'
  },
  {
    'sum(客户编号)': 2665,
    省: '湖北省',
    市: '湖北市1'
  },
  {
    'sum(客户编号)': 1065,
    省: '湖南省',
    市: '湖南市1'

  },
  {
    'sum(客户编号)': 1865,
    省: '河南省',
    市: '河南市1'
  },
  {
    'sum(客户编号)': 2065,
    省: '河北省',
    市: '河北市1'
  },
  {
    'sum(客户编号)': 2065,
    省: '河北省',
    市: '河北市2'
  }
];

let barChart = chart.chart({
  id: 'bar_0',
  autoFit: false,
  width: 1375,
  height: 500,
  data: data
});

barChart.axisY('左坐标轴', {
  position: 'left',
  line: {
    style: {
      lineWidth: 1,
      stroke: '#c2c9d1',
      opacity: 1,
      lineDash: [0, 0]
    }
  },
  tickLine: {
    style: {
      stroke: '#c2c9d1',
      opacity: 1,
      lineWidth: 1
    }
  },
  label: {
    style: {
      fill: 'blue',
      fontStyle: 'normal',
      fontSize: 12,
      fontWeight: 'normal'
    },
    rotate: 0,
    formatter: (text, item, index) => {
      return text;
    }
  },
  title: {
    style: {
      fill: 'blue',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal'
    }
  },
  grid: {
    line: {
      style: {
        stroke: '#c2c9d1',
        opacity: 0,
        lineDash: [0, 0], // [3,3]
        lineWidth: 1
      }
    }
  },
  limitLength: 100
});

barChart.axisY('右坐标轴', {
  position: 'right',
  line: {
    style: {
      lineWidth: 1,
      stroke: '#c2c9d1',
      opacity: 1,
      lineDash: [0, 0]
    }
  },
  tickLine: {
    style: {
      stroke: '#c2c9d1',
      opacity: 1,
      lineWidth: 1
    }
  },
  label: {
    style: {
      fill: 'blue',
      fontStyle: 'normal',
      fontSize: 14,
      fontWeight: 'normal'
    },
    rotate: 0,
    formatter: (text, item, index) => {
      return text;
    }
  },
  title: {
    style: {
      fill: 'blue',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal'
    }
  },
  grid: {
    line: {
      style: {
        stroke: '#c2c9d1',
        opacity: 0,
        lineDash: [0, 0], // [3,3]
        lineWidth: 1
      }
    }
  },
  limitLength: 100
});
barChart.axisX('底部坐标轴', {
  position: 'bottom'
});

barChart.gridX();

barChart.gridY();

// barChart.axisX('顶部坐标轴1', {
//   position: 'top'

// });
// barChart.axisX('顶部坐标轴2', {
//   position: 'top'
// });

barChart.render('bar');
