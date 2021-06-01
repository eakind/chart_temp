import { createPattern } from '../common/containerUtils';
import { getMaxMinValue } from '../common/dataUtils';
const setLinearList = (colorObj, data, format) => {
  let list = colorObj.list;
  if (!(list instanceof Array)) {
    list = [];
  }
  let { max, min } = getMaxMinValue(data, colorObj.feature);
  if (!list.length) {
    list.push({
      color: '#7Ac9f5',
      value: min,
      check: false,
      originValue: min,
      formatValue: format(min)
    }, {
      color: '#2A5783',
      value: max,
      check: false,
      originValue: max,
      formatValue: format(max)
    });
  } else {
    list[0].originValue = min;
    list[1].originValue = max;
    if (!list[0].check) {
      list[0].value = min;
      list[0].formatValue = format(min);
    } else {
      list[0].formatValue = format(list[0].value);
    }
    if (!list[1].check) {
      list[1].value = max;
      list[1].formatValue = format(max);
    } else {
      list[1].formatValue = format(list[1].value);
    }
  }
  return list;
};

const barColor = (middle, colorObj, d, isStroke) => {
  let color = colorObj.color;
  let fillType = colorObj.fillType;
  if (colorObj.type === 'ordinal') {
    if (!d[colorObj.feature]) return color;
    let obj = colorObj.list[d[colorObj.feature]];
    color = obj.color || '#4284f5';
    fillType = obj.fillType || 'fill';
    if (isStroke) return color;
    if (fillType !== 'fill') return createPattern(middle, color, fillType, colorObj.keyId);
    return color;
  } else if (colorObj.type === 'none') {
    if (isStroke) return color;
    if (fillType === 'fill') return color;
    if (fillType !== 'fill') return createPattern(middle, color, fillType, colorObj.keyId);
  } else if (colorObj.type === 'linear') {
    let list = colorObj.list;
    let linear = d3.scaleLinear().domain([list[0].value, list[1].value]).range([0, 1]).clamp(true);
    let value = d[colorObj.feature];
    if (value === null) value = NaN;
    let compute = d3.interpolate(list[0].color, list[1].color);
    return compute(linear(value));
  }
};

const stackBarColor = (middle, fillType, color) => {
  if (fillType !== 'fill') return createPattern(middle, color, fillType);
  return color;
};

export {
  barColor,
  stackBarColor,
  setLinearList
};
