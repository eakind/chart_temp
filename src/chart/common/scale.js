// 返回线性刻度值
const scaleLinear = (minValue, maxValue, height, select) => {
  if (minValue > 0) minValue = 0;
  if (maxValue < 0) maxValue = 0;
  let scale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0]);
  if (select !== 3) {
    scale.nice();
  }
  let scale1 = scale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([height, 0])
    .nice();
  return {
    scaleY: scale,
    scaleY1: scale1
  };
};

// 返回分类刻度值
const scaleBand = (data, barWidth) => {
  let scale = d3.scaleBand();
  scale.domain(data.map((d, index) => {
    return `${d.name}|~|${index}`;
  }));
  scale.range([0, barWidth]);
  return scale;
};

// 返回条形图线性值
const rotateScaleLinear = (minValue, maxValue, height, select) => {
  if (minValue > 0) minValue = 0;
  if (maxValue < 0) maxValue = 0;
  let scale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([0, height]);
  if (select !== 3) {
    scale.nice();
  }
  let scale1 = scale = d3.scaleLinear()
    .domain([minValue, maxValue])
    .range([0, height])
    .nice();
  return {
    scaleY: scale,
    scaleY1: scale1
  };
};

const setScopeList = (scaleY, scopeObj) => {
  let domain = scaleY.domain();
  let ticks = scaleY.ticks();
  if (!isResetScope(scopeObj, domain[1], domain[0])) {
    scopeObj.max = domain[1];
    scopeObj.min = domain[0];
    scopeObj.num = ticks.length;
    scopeObj.range = [domain[0], domain[1]];
    scopeObj.counts = scopeObj.counts || ticks.length;
    scopeObj.select = scopeObj.select ? scopeObj.select : 0;
    // eslint-disable-next-line no-prototype-builtins
    scopeObj.align = scopeObj.align === undefined ? true : scopeObj.align;
    scopeObj.zoom = scopeObj.zoom ? scopeObj.zoom : 1;
  };
};

const getScopeObj = (scopeList, yAxisChild) => {
  for (let i = 0, len = scopeList.length; i < len; i++) {
    let isKey = JSON.stringify(scopeList[i].key) === JSON.stringify(yAxisChild.key);
    let isKeyId = JSON.stringify(scopeList[i].keyId) === JSON.stringify(yAxisChild.keyId);
    if (isKey && isKeyId) {
      // eslint-disable-next-line no-prototype-builtins
      if (scopeList[i].hasOwnProperty('select')) {
        return scopeList[i];
      } else {
        // eslint-disable-next-line no-prototype-builtins
        let scopeObj = scopeList.length ? scopeList.filter(item => item.hasOwnProperty('select'))[0] : null;
        scopeList[i].select = scopeObj ? scopeObj.select : 0;
        scopeList[i].align = scopeObj ? scopeObj.align : true;
        scopeList[i].zoom = scopeObj ? scopeObj.zoom : 1;
        return scopeList[i];
      }
    }
  }
  return {
    key: yAxisChild.key,
    keyId: yAxisChild.keyId
  };
};

const isResetScope = (scopeObj, max, min, yAxisHeight) => {
  if (!scopeObj.range) return false;
  let { scaleY } = scaleLinear(min, max, yAxisHeight);
  let maxValue = scaleY.domain()[1];
  let minValue = scaleY.domain()[0];
  if (maxValue === scopeObj.max && scopeObj.min === minValue) {
    // if (scopeObj.range[1] === scopeObj.max && scopeObj.range[0] === scopeObj.min) {
    //   return false;
    // } else {
    return true;
    // }
  };
  return false;
};

export {
  scaleLinear,
  scaleBand,
  setScopeList,
  getScopeObj,
  isResetScope,
  rotateScaleLinear
};
