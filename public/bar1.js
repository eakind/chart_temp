const config = {
  fitModel: 'standard',
  id: 'mc_bar',
  isCombined: false,
  hasUnit: false,
  size: 100,
  xAxis: [{
    axisType: 'x',
    grid: { line: { show: false, style: { fontColor: '#c2c9d1', lineDash: [0, 0], lineWidth: 1, opacity: 0 } } },
    key: '产品主类',
    label: { style: { fontColor: '#6B6B6B', fontSize: 12, fontWeight: 'normal', opacity: 1, rotate: 0 } },
    line: { show: true, style: { fontColor: '#8643E0', lineDash: [2, 2], lineWidth: 1, opacity: 1 } },
    position: 'bottom',
    title: { axisType: 'x', feature: '产品主类', show: true, style: { fontColor: '#9F6AE7', fontSize: 12, fontStyle: 'normal' }, value: '产品主类' },
    type: ['bar']
  }],
  yAxis: [[{
    position: 'left',
    key: ['sum(平均售价)'],
    type: ['bar'],
    line: { show: true, style: { fontColor: '#8643E0', lineDash: [2, 2], lineWidth: 1, opacity: 1 } },
    label: { style: { fontColor: '#6B6B6B', fontSize: 12, fontWeight: 'normal', opacity: 1, rotate: 0 } },
    title: { axisType: 'y', feature: 'sum(平均售价)', show: true, style: { fontColor: '#6B6B6B', fontSize: 12, fontStyle: 'normal' }, value: ['sum(平均售价)'] },
    grid: { line: { show: false, style: { fontColor: '#c2c9d1', lineDash: [0, 0], lineWidth: 1, opacity: 0 } } },
    data: [[{ 'sum(平均售价)': 466142.4456050269, 产品主类: 'null' }, { 'sum(平均售价)': 345325.98887444456, 产品主类: '个人护理' }, { 'sum(平均售价)': 58026.10978111717, 产品主类: '儿童' }, { 'sum(平均售价)': 24809.864154305025, 产品主类: '化妆工具' }, { 'sum(平均售价)': 45968.02673267312, 产品主类: '居家日用' }, { 'sum(平均售价)': 806906.1973640231, 产品主类: '彩妆' }, { 'sum(平均售价)': 2167059.9126318456, 产品主类: '护肤品' }, { 'sum(平均售价)': 2318.4120035770006, 产品主类: '服饰' }, { 'sum(平均售价)': 144279.84805351796, 产品主类: '男士' }, { 'sum(平均售价)': 211785.4346065001, 产品主类: '面膜' }]]
  }]],
  xAxisPart: null,
  yAxisPart: null,
  labelsList: null,
  tooltipList: [{ type: 'ordinal', key: '产品主类', title: '产品主类', display: 'auto', format: {}, text: { fontColor: '#6b6b6b', fontSize: 12, textAlign: 'left', lineHeight: 24, display: 'auto' } }, { type: 'linear', key: 'sum(平均售价)', title: 'sum(平均售价)', display: 'auto', format: { selectFormat: -1, decimal: 2, negative: '-1', unit: '', prefix: '', suffix: '', zone: 'CN', useThousandMark: true }, text: { fontColor: '#6b6b6b', fontSize: 12, textAlign: 'left', lineHeight: 24, display: 'auto' } }],
  colorList: [{ feature: '', type: 'none', key: 'sum(平均售价)', color: '#4284f5', list: [], opacity: 100 }]
};
const data = {};
console.log(config);
let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
console.log(test.getColorList());
// ['fill', 'zuo', 'you', 'heng', 'shu', 'ge', 'zha', 'empty'];
// 一个cat 一个aggr
