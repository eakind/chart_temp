let mapConfig = {
  autoFit: true,
  width: '600',
  height: '400',
  bindto: '#map_1',
  id: 'map_1',
  labelsList: [],
  tooltipList: [
    {
      type: 'linear',
      key: 'sum(销售金额)',
      title: 'sum(销售金额)',
      display: 'auto',
      format: {
        decimal: 2,
        negative: -1,
        prefix: '',
        selectFormat: 'digit',
        suffix: '',
        unit: 'M',
        useThousandMark: true,
        zone: 'CN'
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
      key: '省份',
      title: '省份',
      display: 'auto',
      format: {
        align: 'right',
        decoration: 'underline',
        fontColor: 'black',
        fontSize: 12,
        fontStyle: '',
        letterSpacing: '0',
        lineHeight: '19'
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
  sizeFeature: { feature: 'sum(销售金额)' },
  labelFeature: ['sum(销售金额)', '省份'],
  // colorFeature: { feature: 'sum(销售金额)', type: 'linear', stacked: false },
  colorFeature: {},
  column: {
    aggressions: ['latitude']
  },
  row: {
    aggressions: ['longitude']
  },
  point: {
    size: 2
  }
};
let mapData = [
  { 'sum(销售金额)': 151682777.09000546, 省份: '河南省', latitude: 34.757975, longitude: 113.665412 },
  { 'sum(销售金额)': 101229200.95999943, 省份: '浙江省', latitude: 30.287459, longitude: 120.153576 },
  { 'sum(销售金额)': 11932274.78999999, 省份: '吉林省', latitude: 43.886841, longitude: 125.3245 },
  { 'sum(销售金额)': 68320015.72999907, 省份: '四川省', latitude: 30.659462, longitude: 104.065735 },
  { 'sum(销售金额)': 3731732.48999999, 省份: '天津市', latitude: 39.125596, longitude: 117.190182 },
  { 'sum(销售金额)': 9656606.460000008, 省份: '宁夏', latitude: 38.46637, longitude: 106.278179 },
  { 'sum(销售金额)': 54926494.39999879, 省份: '安徽省', latitude: 31.86119, longitude: 117.283042 },
  { 'sum(销售金额)': 116092377.04000114, 省份: '山东省', latitude: 36.675807, longitude: 117.000923 },
  { 'sum(销售金额)': 14982340.380000211, 省份: '山西省', latitude: 37.857014, longitude: 112.549248 },
  { 'sum(销售金额)': 34657181.70000026, 省份: '广东省', latitude: 23.125178, longitude: 113.280637 },
  { 'sum(销售金额)': 5409940.109999983, 省份: '广西省', latitude: 22.82402, longitude: 108.320004 },
  { 'sum(销售金额)': 93506928.76000081, 省份: '新疆', latitude: 43.792818, longitude: 87.617733 },
  { 'sum(销售金额)': 73817839.26999827, 省份: '河北省', latitude: 38.045474, longitude: 114.502461 },
  { 'sum(销售金额)': 47782957.6399988, 省份: '江西省', latitude: 28.676493, longitude: 115.892151 }
];

let mapInstance = chart.GeometryDrawingProcess({ data: mapData, config: mapConfig, chartType: 'map' });

mapInstance.draw();
