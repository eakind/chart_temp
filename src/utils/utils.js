import { getMaxValue } from '../chart/common/dataUtils';
const getTextLegend = (text, fontSize) => {
  let textLen = String(text).length;
  return (textLen * fontSize) / 2 + fontSize;
};

let dataProcess = function (val, format) {
  if (!val) {
    return val;
  }
  if (typeof format.selectFormat === 'undefined') {
    return val;
  }
  if (!Number(val)) {
    return val;
  }
  let ret = val;

  let negative = -1;
  if (ret < 0) {
    if (format.negative === '(1234)') {
      negative = 0;
    } else if (format.negative === '1234-') {
      negative = 1;
    } else {
      negative = 2;
    }
  }
  ret = unitProcess(ret, format.unit, format.useThousandMark, format);

  ret = displayFormatProcess(ret, format.selectFormat, format.zone, negative);
  ret = prefSuffixProcess(ret, format.prefix, format.suffix, format.isPercent);
  return ret;
};

let unitProcess = function (val, unit, micrometerFlag, format) {
  let unitPare = {
    'K 千': 1000,
    'M 百万': 1000000,
    'G 十亿': 1000000000,
    'T 千亿': 100000000000
  };
  let ret = val;
  if (unit && format.selectFormat !== 'percent') {
    ret = val / unitPare[unit];
  }
  if (format.decimal || format.decimal === 0) {
    if (format.isPercent || format.selectFormat === 'percent') {
      ret = ret * 100;
    }
    ret = ret.toFixed(format.decimal);
    if (format.isPercent) {
      ret = ret + '%';
    }
  }

  // let ret = val / unitPare[unit];
  let curRes = micrometerProcess(ret, micrometerFlag);
  if (format.selectFormat === 'percent') {
    return curRes;
  } else {
    return unit ? curRes + unit : curRes;
  }
  // return unit ? curRes + unit : curRes;
};

let displayFormatProcess = function (val, format, zone, negative) {
  // if (!format) {
  //   return val;
  // }
  if (negative === 0) {
    val = '(' + val.substring(1) + ')';
  } else if (negative === 1) {
    val = val.substring(1) + '-';
  }
  if (format === 'percent' || format === -1) {
    return val;
  }
  let formatPare = {
    CN: '￥',
    JP: '¥',
    HK: 'HK$',
    US: '＄',
    EUR: '€',
    GBP: '£'
  };
  if (negative === -1) {
    return formatPare[zone] ? formatPare[zone] + val : val;
  }

  return formatPare[zone] ? formatPare[zone] + val : val;
};

let prefSuffixProcess = function (val, prefix, suffix, isPercent) {
  if (prefix) {
    val = prefix + val;
  }
  if (suffix && !isPercent) {
    val = val + suffix;
  } else if (isPercent) {
    if (suffix && suffix.indexOf('%') === 0) {
      val = val + suffix.substr(1);
    } else if (suffix && suffix.indexOf('%') !== 0) {
      val = val.substr(0, val.length - 1) + suffix;
    }
  }
  return val;
};

let micrometerProcess = function (val, flag) {
  if (!flag || val < 1000) {
    return val;
  }
  let ret = '';
  let list = [];
  let curStr = val.toString().split('.');
  for (let i = curStr[0].length - 1; i >= 0; i--) {
    list.push(curStr[0][i]);
    if ((curStr[0].length - 1 - i) % 3 === 2) {
      ret = ',' + list.reverse().join('') + ret;
      list = [];
    }
  }
  if (ret) {
    ret = list.length === 0 ? ret.substr(1) : ret;
  }
  ret = list.reverse().join('') + ret;
  return curStr.length > 1 ? ret + '.' + curStr[1] : ret;
};

let styleProcess = function (styleObj) {
  return ` text-align: ${styleObj.align || 'left'};
  color:  ${styleObj.fontColor};
  font-size:  ${styleObj.fontSize + 'px'};
  font-style:  ${styleObj.fontStyle};
  line-height:  ${styleObj.lineHeight + 'px'};
  letter-spacing:  ${styleObj.letterSpacing + 'px'}`;
};

let toScientificNotation = function (val) {
  // if (!val) {
  //   return;
  // }
  val = val - 0;
  // let ret = val.toString();
  // if (ret.length <= 4) {
  //   return ret;
  // } else if (ret.length <= 6) {
  //   return (ret / 1000).toFixed(2) + 'K';
  // } else if (ret.length <= 9) {
  //   return (ret / 1000000).toFixed(2) + 'M';
  // } else {
  //   return (ret / 1000000000).toFixed(2) + 'G';
  // }
  let ret = Math.floor(val).toString();
  if (ret.length <= 4) {
    return val.toFixed(2);
  } else if (ret.length <= 6) {
    return (val / 1000).toFixed(2) + 'K';
  } else if (ret.length <= 9) {
    return (val / 1000000).toFixed(2) + 'M';
  } else {
    return (val / 1000000000).toFixed(2) + 'G';
  }
};

let getTextWidth = function (str, font) {
  let canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.font = font || '12px sans-serif';
  let { width } = context.measureText(str);
  return width;
};

const fontSizeLineHeightPair = {
  8: 12,
  9: 12,
  10: 12,
  12: 18,
  14: 20,
  16: 24,
  18: 26,
  20: 30,
  24: 34,
  28: 36,
  30: 40,
  32: 44,
  36: 54,
  40: 56,
  48: 60,
  56: 64,
  64: 72,
  72: 88
};

const hasValue = (arr, key, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) {
      return true;
    }
  }
  return false;
};

const uniqueKeyArr = (key, list) => {
  let arr = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (!hasValue(arr, key, list[i][key])) {
      arr.push(list[i]);
    }
  }
  return arr;
};

const setUnitHeight = (height, text, data, axisKey, isUnit, index) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0, len = arr.length; i < len; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  console.log(start);
  return num * height * index - (getTxtWidth(text, 14) / 2);
  // return isUnit ? num * height * index : (height * start) + (num * height - getTxtWidth(text, 14)) / 2;
};

const setPartHeight = (d, data, perKey, key) => {
  let arr = data.filter(item => item[key[0]] === d);
  let len = arr.length;
  let perArr = [];
  for (let i = 0; i < len; i++) {
    perArr.push(arr[i][perKey[0]]);
  }
  perArr = [...new Set(perArr)];
  return perArr.length;
};

const setTextPos = (width, text, data, axisKey) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0; i < arr.length; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  return (width * start) + ((width * num - getTxtWidth(text, 14)) / 2);
};

const setLinePos = (width, text, data, axisKey) => {
  let num = 0;
  let start = 0;
  let arr = uniqueKeyArr(axisKey, data);
  for (let i = 0; i < arr.length; i++) {
    for (let key in arr[i]) {
      if (arr[i][key] === text) {
        if (num === 0) {
          start = i;
        }
        num++;
      }
    }
  }
  return (width * start) + (width * num);
};

const getTxtWidth = (text, font) => {
  let textDom = document.createElement('text');
  textDom.innerText = text;
  textDom.style.fontSize = font + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let width = textDom.clientWidth;
  document.body.removeChild(textDom);
  return width;
};

const getTxtHeight = (text, font) => {
  let textDom = document.createElement('span');
  textDom.innerText = text;
  textDom.style.fontSize = font + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let height = textDom.clientHeight;
  document.body.removeChild(textDom);
  return height;
};

const getTopAxisHeight = (xAxisPart) => {
  if (!xAxisPart || xAxisPart.length === 0) return 16;
  else return (xAxisPart.length) * 32 + 16;
};

const setAsideWidth = (yAxis, maxValue, yAxisPart, isRotatd) => {
  let titleLen = 0;
  let width = 0;
  if (yAxis) {
    let txtLen = 0;
    if (isRotatd && yAxis.label.rotate === 0) {
      txtLen = getTxtHeight(String(Math.floor(maxValue)), yAxis.label.style.fontSize);
    } else {
      txtLen = getTxtWidth(String(Math.floor(maxValue)), 14) + 12;
    }
    titleLen = getTxtWidth('哈', 20);
    width = txtLen + titleLen;
  }
  return {
    axisWidth: yAxisPart ? yAxisPart.length * 50 + width : width,
    titleWidth: width
  };
};

const setBottomLabelHeight = (xAxis, xData, isRotated) => {
  let label = xAxis.label;
  let longest = xData.reduce((a, b) => String(a).length > String(b).length ? a : b);
  let height = getTxtHeight(String(longest), label.style.fontSize);
  let width = getTxtWidth(String(longest), label.style.fontSize);
  let rotate = label.rotate;
  if (rotate !== 0 && !isRotated) {
    return width;
  }
  if (isRotated && rotate !== 90) {
    return width;
  }
  return height;
};

const combinedData = (list) => {
  if (!list.length) return [];
  let dataList = list[0].data;
  let data = [];
  for (let i = 0, len = dataList.length; i < len; i++) {
    data.push(...dataList[i]);
  }
  return data;
};

const getMaxValueWidth = (yAxis, yAxisPart, position, isRotated) => {
  let maxTitleWidthArr = [];
  let axisWidthArr = [];
  for (let i = 0, len = yAxis.length; i < len; i++) {
    let axisList = yAxis[i].filter(item => item.position === position);
    let data = combinedData(axisList);
    if (axisList.length) {
      let maxValue = getMaxValue(data, axisList[0].key);
      let { axisWidth, titleWidth } = setAsideWidth(axisList[0], Math.floor(maxValue), yAxisPart, isRotated);
      maxTitleWidthArr.push(titleWidth);
      axisWidthArr.push(axisWidth);
    }
  };
  let obj = {};
  obj[`${position}TitleWidth`] = maxTitleWidthArr.length ? Math.max(...maxTitleWidthArr) : 0;
  obj[`${position}AxisWidth`] = axisWidthArr.length ? Math.max(...axisWidthArr) : 0;
  return obj;
};

const hexToRgba = (hex, opacity) => {
  if (typeof hex === 'object') hex = hex.background;
  if (hex === '#fff') hex = '#ffffff';
  if (hex === '#000') hex = '#000000';
  if (!opacity && opacity !== 0) opacity = 100;
  if (!hex) return 'rbga(255,255,255,0)';
  let r = parseInt('0x' + hex.slice(1, 3));
  let g = parseInt('0x' + hex.slice(3, 5));
  let b = parseInt('0x' + hex.slice(5, 7));
  if (opacity < 1 && opacity > 0) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  let a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const hasColorFeature = (list, name, keyId, xAxisPart) => {
  if (!list) {
    return {
      type: 'none',
      color: '#4284f5'
    };
  }
  for (let i = 0, len = list.length; i < len; i++) {
    if (name.includes(list[i].keyName) && keyId === list[i].keyId) {
      return list[i];
    }
  }
  return {
    type: 'none',
    color: '#4284f5'
  };
};

export {
  getTextLegend,
  dataProcess,
  styleProcess,
  toScientificNotation,
  getTextWidth,
  fontSizeLineHeightPair,
  setTextPos,
  setLinePos,
  getTxtWidth,
  getTopAxisHeight,
  setBottomLabelHeight,
  setUnitHeight,
  setPartHeight,
  getMaxValueWidth,
  hexToRgba,
  hasColorFeature
};
