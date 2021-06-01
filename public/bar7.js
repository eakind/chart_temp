const config = {
  fitModel: 'standard',
  id: 'mc_bar',
  isCombined: false,
  xAxis: [{
    position: 'bottom',
    key: '产品主类',
    type: ['bar'],
    line: {
      show: true,
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: '#6B6B6B',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    },
    title: {
      value: '产品主类',
      show: true,
      style: {
        fontColor: '#6B6B6B',
        fontSize: 14,
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        show: true,
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0],
          lineWidth: 1
        }
      }
    }
  }],
  yAxis: [
    [{
      position: 'left',
      key: ['sum(销售数量)'],
      type: ['bar'],
      line: {
        show: true,
        style: {
          lineWidth: 1,
          fontColor: '#c2c9d1',
          opacity: 1,
          lineDash: [0, 0]
        }
      },
      label: {
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontWeight: 'normal',
          opacity: 1
        },
        rotate: 0
      },
      title: {
        value:
          ['sum(销售数量)'],
        show: true,
        style: {
          fontColor: '#6B6B6B',
          fontSize: 14,
          fontStyle: 'normal'
        }
      },
      grid: {
        line: {
          show: true,
          style: {
            fontColor: '#c2c9d1',
            opacity: 0,
            lineDash: [0, 0],
            lineWidth: 1
          }
        }
      },
      data: [
        [
          { 'sum(销售数量)': 24522325, 产品主类: 'null' },
          { 'sum(销售数量)': 6975083, 产品主类: '个人护理' },
          { 'sum(销售数量)': 841469, 产品主类: '儿童' },
          { 'sum(销售数量)': 307463, 产品主类: '化妆工具' },
          { 'sum(销售数量)': 3887327, 产品主类: '居家日用' },
          { 'sum(销售数量)': 3361398, 产品主类: '彩妆' },
          { 'sum(销售数量)': 5138975, 产品主类: '护肤品' },
          { 'sum(销售数量)': 280937, 产品主类: '服饰' },
          { 'sum(销售数量)': 285679, 产品主类: '男士' },
          { 'sum(销售数量)': 2805643, 产品主类: '面膜' }]]
    }]],
  xAxisPart: null,
  yAxisPart: null,
  labelsList: null,
  tooltipList: [
    {
      type: 'ordinal',
      key: '产品主类',
      title: '产品主类',
      display: 'auto',
      format: {},
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    },
    {
      type: 'linear',
      key: 'sum(销售数量)',
      title: 'sum(销售数量)',
      display: 'auto',
      format: {
        selectFormat: -1,
        decimal: 2,
        negative: '-1',
        unit: '',
        prefix: '',
        suffix: '',
        zone: 'CN',
        useThousandMark: true
      },
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    }
  ],
  colorList: [
    { feature: '', type: 'none', key: 'sum(记录数)', color: 'green' }
  ]
};
const data = [];
console.log(config);
let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
