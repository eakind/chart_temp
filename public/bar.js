const config = {
  autoFit: false,
  fitWidth: true,
  fitHeight: false,
  width: 600,
  height: 600,
  id: 'mc_bar',
  // xAxisPart: [{
  //   position: 'top',
  //   key: '区域',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     value: '市/省',
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }, {
  //   position: 'top',
  //   key: '省',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }, {
  //   position: 'top',
  //   key: '市',
  //   line: {
  //     style: {
  //       lineWidth: 1,
  //       fontColor: '#c2c9d1',
  //       opacity: 1,
  //       lineDash: [0, 0]
  //     }
  //   },
  //   label: {
  //     style: {
  //       fontColor: 'blue',
  //       fontStyle: 'normal',
  //       fontSize: 14,
  //       fontWeight: 'normal',
  //       opacity: 1
  //     },
  //     rotate: 0
  //   },
  //   title: {
  //     style: {
  //       fontColor: 'blue',
  //       fontSize: 16,
  //       fontWeight: 'normal',
  //       fontStyle: 'normal'
  //     }
  //   },
  //   grid: {
  //     line: {
  //       style: {
  //         fontColor: '#c2c9d1',
  //         opacity: 0,
  //         lineDash: [0, 0], // [3,3]
  //         lineWidth: 1
  //       }
  //     }
  //   }
  // }],
  xAxis: [{
    position: 'bottom',
    key: '产品主类',
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    },
    title: {
      value: 'X轴哈哈哈',
      style: {
        fontColor: 'blue',
        fontSize: 16,
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  }],
  yAxisPart: [{
    position: 'left-part',
    key: ['市'],
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    }
  }, {
    position: 'left-part',
    key: ['省'],
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0
    }
  }, {
    position: 'left-part',
    key: ['区域'],
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
      value: '区域',
      style: {
        fontColor: 'blue',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  }],
  yAxis: [{
    position: 'left',
    type: ['bar'],
    key: ['sum(客户编号)'],
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
      value: 'sum(客户编号)',
      style: {
        fontColor: 'blue',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  }, {
    position: 'right',
    type: ['line'], // 组合图需要
    key: ['sum(平均售价)', 'sum(销售金额)'],
    line: {
      style: {
        lineWidth: 1,
        fontColor: '#c2c9d1',
        opacity: 1,
        lineDash: [0, 0]
      }
    },
    label: {
      style: {
        fontColor: 'blue',
        fontStyle: 'normal',
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 1
      },
      rotate: 0,
      formatter: (text, item, index) => {
        return text;
      }
    },
    title: {
      value: 'sum(平均售价)',
      style: {
        fontColor: 'blue',
        fontSize: 16,
        fontWeight: 'normal',
        fontStyle: 'normal'
      }
    },
    grid: {
      line: {
        style: {
          fontColor: '#c2c9d1',
          opacity: 0,
          lineDash: [0, 0], // [3,3]
          lineWidth: 1
        }
      }
    }
  }]
  // labelsList: [
  //   {
  //     type: 'linear',
  //     key: 'sum(销售金额)',
  //     title: 'sum(客户编号)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   }
  //   // {
  //   //   type: 'linear',
  //   //   key: 'median(客户ID) percent',
  //   //   title: 'median(客户ID) percent',
  //   //   display: 'auto',
  //   //   format: {
  //   //     selectFormat: 'percent',
  //   //     decimal: 2,
  //   //     prefix: '',
  //   //     suffix: '%',
  //   //     isPercent: true
  //   //   },
  //   //   text: {
  //   //     fontColor: '#6b6b6b',
  //   //     fontSize: 12,
  //   //     textAlign: 'left',
  //   //     lineHeight: 24,
  //   //     display: 'auto'
  //   //   }
  //   // },
  //   // {
  //   //   type: 'ordinal',
  //   //   key: '区域',
  //   //   title: '区域',
  //   //   display: 'auto',
  //   //   format: {},
  //   //   text: {
  //   //     fontColor: '#6b6b6b',
  //   //     fontSize: 12,
  //   //     textAlign: 'left',
  //   //     lineHeight: 24,
  //   //     display: 'auto'
  //   //   }
  //   // }
  // ]
  // tooltipList: [
  //   {
  //     type: 'linear',
  //     key: 'median(客户ID)',
  //     title: 'median(客户ID)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'linear',
  //     key: 'median(客户ID) percent',
  //     title: 'median(客户ID) percent',
  //     display: 'auto',
  //     format: {
  //       selectFormat: 'percent',
  //       decimal: 2,
  //       prefix: '',
  //       suffix: '%',
  //       isPercent: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'linear',
  //     key: 'sum(数量)',
  //     title: 'sum(数量)',
  //     display: 'auto',
  //     format: {
  //       selectFormat: -1,
  //       decimal: 2,
  //       negative: '-1',
  //       unit: '',
  //       prefix: '',
  //       suffix: '',
  //       zone: 'CN',
  //       useThousandMark: true
  //     },
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   },
  //   {
  //     type: 'ordinal',
  //     key: '区域',
  //     title: '区域',
  //     display: 'auto',
  //     format: {},
  //     text: {
  //       fontColor: '#6b6b6b',
  //       fontSize: 12,
  //       textAlign: 'left',
  //       lineHeight: 24,
  //       display: 'auto'
  //     }
  //   }
  // ],
  // labelFeature: [
  //   { type: 'linear', feature: 'median(客户ID)' },
  //   { type: 'ordinal', feature: '区域' }
  // ],
  // colorFeature: { feature: 'median(客户ID)', type: 'linear', stacked: false }
};

const data = [
  // { 'sum(客户编号)': 500, 'sum(平均售价)': 1200, 'sum(销售金额)': 2320, 'sum(销售数量)': 3100, 省: '云南省', 市: '大理市', 区域: '西南', 产品主类: '护理' },
  // { 'sum(客户编号)': 331, 'sum(平均售价)': 1300, 'sum(销售金额)': 2320, 'sum(销售数量)': 3200, 省: '云南省', 市: '大理市', 区域: '西南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 662, 'sum(平均售价)': 1340, 'sum(销售金额)': 2320, 'sum(销售数量)': 3300, 省: '云南省', 市: '大理市', 区域: '西南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 440, 'sum(平均售价)': 1350, 'sum(销售金额)': 2320, 'sum(销售数量)': 3400, 省: '云南省', 市: '昆明市', 区域: '西南', 产品主类: '护理' },
  // { 'sum(客户编号)': 231, 'sum(平均售价)': 1310, 'sum(销售金额)': 2320, 'sum(销售数量)': 3500, 省: '云南省', 市: '昆明市', 区域: '西南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 778, 'sum(平均售价)': 1200, 'sum(销售金额)': 2320, 'sum(销售数量)': 3600, 省: '云南省', 市: '昆明市', 区域: '西南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 550, 'sum(平均售价)': 1220, 'sum(销售金额)': 2320, 'sum(销售数量)': 3700, 省: '云南省', 市: '丽江市', 区域: '西南', 产品主类: '护理' },
  // { 'sum(客户编号)': 351, 'sum(平均售价)': 1210, 'sum(销售金额)': 2320, 'sum(销售数量)': 3800, 省: '云南省', 市: '丽江市', 区域: '西南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 665, 'sum(平均售价)': 1280, 'sum(销售金额)': 2320, 'sum(销售数量)': 3900, 省: '云南省', 市: '丽江市', 区域: '西南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 2100, 'sum(平均售价)': 1000, 'sum(销售金额)': 2320, 'sum(销售数量)': 4000, 省: '广东省', 市: '广州市', 区域: '华南', 产品主类: '护理' },
  // { 'sum(客户编号)': 2250, 'sum(平均售价)': 2300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4100, 省: '广东省', 市: '广州市', 区域: '华南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 1880, 'sum(平均售价)': 3300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4200, 省: '广东省', 市: '广州市', 区域: '华南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 2120, 'sum(平均售价)': 4300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4300, 省: '广东省', 市: '深圳市', 区域: '华南', 产品主类: '护理' },
  // { 'sum(客户编号)': 2670, 'sum(平均售价)': 1300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4400, 省: '广东省', 市: '深圳市', 区域: '华南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 1924, 'sum(平均售价)': 1600, 'sum(销售金额)': 2320, 'sum(销售数量)': 4500, 省: '广东省', 市: '深圳市', 区域: '华南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 2130, 'sum(平均售价)': 1700, 'sum(销售金额)': 2320, 'sum(销售数量)': 4600, 省: '广东省', 市: '佛山市', 区域: '华南', 产品主类: '护理' },
  // { 'sum(客户编号)': 1665, 'sum(平均售价)': 1400, 'sum(销售金额)': 2320, 'sum(销售数量)': 4700, 省: '广东省', 市: '佛山市', 区域: '华南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 2310, 'sum(平均售价)': 1500, 'sum(销售金额)': 2320, 'sum(销售数量)': 4800, 省: '广东省', 市: '佛山市', 区域: '华南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 3500, 'sum(平均售价)': 1600, 'sum(销售金额)': 2320, 'sum(销售数量)': 4900, 省: '广西省', 市: '南宁市', 区域: '华南', 产品主类: '护理' },
  // { 'sum(客户编号)': 3510, 'sum(平均售价)': 1200, 'sum(销售金额)': 2320, 'sum(销售数量)': 5000, 省: '广西省', 市: '南宁市', 区域: '华南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 3520, 'sum(平均售价)': 1700, 'sum(销售金额)': 2320, 'sum(销售数量)': 5100, 省: '广西省', 市: '南宁市', 区域: '华南', 产品主类: '化妆' },
  // { 'sum(客户编号)': 2065, 'sum(平均售价)': 1900, 'sum(销售金额)': 2320, 'sum(销售数量)': 5200, 省: '湖南省', 市: '长沙市', 区域: '华南', 产品主类: '护理' },
  // { 'sum(客户编号)': 1265, 'sum(平均售价)': 1800, 'sum(销售金额)': 2320, 'sum(销售数量)': 3100, 省: '湖南省', 市: '长沙市', 区域: '华南', 产品主类: '护肤' },
  // { 'sum(客户编号)': 1865, 'sum(平均售价)': 1900, 'sum(销售金额)': 2320, 'sum(销售数量)': 3200, 省: '湖南省', 市: '长沙市', 区域: '华南', 产品主类: '化妆' },
  { 'sum(客户编号)': 3500, 'sum(平均售价)': 2300, 'sum(销售金额)': 2320, 'sum(销售数量)': 3300, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '护理' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 2300, 'sum(销售金额)': 2320, 'sum(销售数量)': 3400, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '护肤' },
  { 'sum(客户编号)': 1265, 'sum(平均售价)': 2400, 'sum(销售金额)': 2320, 'sum(销售数量)': 3500, 省: '湖北省', 市: '武汉市', 区域: '华中', 产品主类: '化妆' },
  { 'sum(客户编号)': 2865, 'sum(平均售价)': 1500, 'sum(销售金额)': 2320, 'sum(销售数量)': 3600, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '护理' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 1600, 'sum(销售金额)': 2320, 'sum(销售数量)': 3700, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '护肤' },
  { 'sum(客户编号)': 1965, 'sum(平均售价)': 1800, 'sum(销售金额)': 2320, 'sum(销售数量)': 3800, 省: '河南省', 市: '郑州市', 区域: '华中', 产品主类: '化妆' },
  { 'sum(客户编号)': 1065, 'sum(平均售价)': 1190, 'sum(销售金额)': 2320, 'sum(销售数量)': 3900, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '护理' },
  { 'sum(客户编号)': 2065, 'sum(平均售价)': 1300, 'sum(销售金额)': 2320, 'sum(销售数量)': 4000, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '护肤' },
  { 'sum(客户编号)': 1865, 'sum(平均售价)': 1200, 'sum(销售金额)': 2320, 'sum(销售数量)': 3100, 省: '福建省', 市: '厦门市', 区域: '华东', 产品主类: '化妆' },
  { 'sum(客户编号)': 1165, 'sum(平均售价)': 1290, 'sum(销售金额)': 2120, 'sum(销售数量)': 3900, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '护理' },
  { 'sum(客户编号)': 2165, 'sum(平均售价)': 1200, 'sum(销售金额)': 2120, 'sum(销售数量)': 4000, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '护肤' },
  { 'sum(客户编号)': 1265, 'sum(平均售价)': 1100, 'sum(销售金额)': 2120, 'sum(销售数量)': 3100, 省: '福建省', 市: '福州市', 区域: '华东', 产品主类: '化妆' },
  { 'sum(客户编号)': 1065, 'sum(平均售价)': 1100, 'sum(销售金额)': 2020, 'sum(销售数量)': 3200, 省: '福建省', 市: '泉州市', 区域: '华东', 产品主类: '护理' },
  { 'sum(客户编号)': 1765, 'sum(平均售价)': 1000, 'sum(销售金额)': 2020, 'sum(销售数量)': 3300, 省: '福建省', 市: '泉州市', 区域: '华东', 产品主类: '护肤' },
  { 'sum(客户编号)': 2065, 'sum(平均售价)': 1300, 'sum(销售金额)': 2020, 'sum(销售数量)': 3400, 省: '福建省', 市: '泉州市', 区域: '华东', 产品主类: '化妆' }];

// const data = [
//   { 'sum(客户编号)': 3500, 市: '广州市', 'sum(平均售价)': 1200, 'sum(销售金额)': 1320 },
//   { 'sum(客户编号)': 2820, 市: '深圳市', 'sum(平均售价)': 1300, 'sum(销售金额)': 1400 },
//   { 'sum(客户编号)': 2290, 市: '上海市', 'sum(平均售价)': 1400, 'sum(销售金额)': 1300 },
//   { 'sum(客户编号)': 4220, 市: '北京市', 'sum(平均售价)': 1500, 'sum(销售金额)': 1560 },
//   { 'sum(客户编号)': 500, 市: '天津市', 'sum(平均售价)': 1250, 'sum(销售金额)': 1290 },
//   { 'sum(客户编号)': 2620, 市: '佛山市', 'sum(平均售价)': 1300, 'sum(销售金额)': 1200 },
//   { 'sum(客户编号)': 1920, 市: '杭州市', 'sum(平均售价)': 1400, 'sum(销售金额)': 1400 },
//   { 'sum(客户编号)': 2020, 市: '厦门市', 'sum(平均售价)': 1500, 'sum(销售金额)': 1500 },
//   { 'sum(客户编号)': 5500, 市: '武汉市', 'sum(平均售价)': 1100, 'sum(销售金额)': 2100 }
// ];

// const data = [
//   { 'sum(客户编号)': 3100, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 3200, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 2500, 产品主类: '化妆品' },
//   { 'sum(客户编号)': 3500, 产品主类: '化妆品' }
// ];

let test = chart.GeometryDrawingProcess({ data, config, chartType: 'bar' });
test.draw();
