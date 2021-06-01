let config = {
  width: 400,
  height: 190,
  id: 'mc_pie_53dd28945f7f11eba51b0242ac120007',
  colorList: [
    '#4284F5',
    '#f45',
    '#3FAECC',
    '#FACC14',
    '#F5282D',
    '#8543E0',

    '#3110D0',
    '#E88F00',
    '#DE2393',
    '#91BA38',
    '#99B4BF',
    '#216A58',
    '#AB9438',
    '#F4999B',
    '#C9BFE1',
    '#055166',
    '#1F135A',
    '#43140A',
    '#96005A',
    '#8D8D8D'
  ],
  colorOpacity: 50,
  labelsList: [
    {
      type: 'linear',
      key: 'median(客户ID)',
      title: 'median(客户ID)',
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
    },
    {
      type: 'linear',
      key: 'median(客户ID) percent',
      title: 'median(客户ID) percent',
      display: 'auto',
      format: {
        selectFormat: 'percent',
        decimal: 2,
        prefix: '',
        suffix: '%',
        isPercent: true
      },
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    },
    {
      type: 'ordinal',
      key: '区域',
      title: '区域',
      display: 'auto',
      format: {},
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    }
  ],
  tooltipList: [
    {
      type: 'linear',
      key: 'median(客户ID)',
      title: 'median(客户ID)',
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
    },
    {
      type: 'linear',
      key: 'median(客户ID) percent',
      title: 'median(客户ID) percent',
      display: 'auto',
      format: {
        selectFormat: 'percent',
        decimal: 2,
        prefix: '',
        suffix: '%',
        isPercent: true
      },
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
      key: 'sum(数量)',
      title: 'sum(数量)',
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
    },
    {
      type: 'ordinal',
      key: '区域',
      title: '区域',
      display: 'auto',
      format: {},
      text: {
        fontColor: '#6b6b6b',
        fontSize: 12,
        textAlign: 'left',
        lineHeight: 24,
        display: 'auto'
      }
    }
  ],
  sizeFeature: { feature: 'median(客户ID)' },
  labelFeature: [
    { type: 'linear', feature: 'median(客户ID)' },
    { type: 'ordinal', feature: '区域' }
  ],
  colorFeature: { feature: 'median(客户ID)', type: 'linear', stacked: false },
  size: 0.85,
  innerRadius: 1
};
let data = [
  {
    'median(客户ID)': 1856,
    'median(客户ID) percent': 0.4286374133949192,
    'sum(数量)': 520507,
    区域: '西南区'
  },
  {
    'median(客户ID)': 899,
    'median(客户ID) percent': 0.17967667436489607,
    'sum(数量)': 1489168,
    区域: '华北区'
  },
  {
    'median(客户ID)': 600,
    'median(客户ID) percent': 0.16096997690531178,
    'sum(数量)': 2995658,
    区域: '西北区'
  },
  {
    'median(客户ID)': 628,
    'median(客户ID) percent': 0.14503464203233257,
    'sum(数量)': 12566111,
    区域: '华东区'
  },
  {
    'median(客户ID)': 371,
    'median(客户ID) percent': 0.08568129330254041,
    'sum(数量)': 6665187,
    区域: '华南区'
  }
];
let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bubble' });

test.draw();
