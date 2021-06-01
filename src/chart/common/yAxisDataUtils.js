import { getUniqueList } from './dataUtils';
const setYAxisPartList = (yAxisPart, yAxis, xKey, colorList, xAxisList, xAxisPart, chartType, xPartList) => {
  let yAxisPartLen = yAxisPart.length;
  let leftMaxValue = 0;
  let leftMinValue = 0;
  let rightMaxValue = 0;
  let rightMinValue = 0;
  let yPartList = [];
  let yAxisNum = 1;
  if (!yAxisPartLen) {
    // 返回左侧坐标轴的最大值
    let { leftMax, leftMin } = setYAxisMaxValue(yAxis, xKey, colorList, 'left', xAxisPart, chartType, xPartList);
    leftMaxValue = leftMax;
    leftMinValue = leftMin;
    // 返回右侧坐标轴的最大值
    let { rightMax, rightMin } = setYAxisMaxValue(yAxis, xKey, colorList, 'right', xAxisPart, chartType, xPartList);
    rightMaxValue = rightMax;
    rightMinValue = rightMin;
  } else {
    let xLen = xAxisList.length;
    for (let i = 0; i < yAxis.length; i++) {
      let data = yAxis[i][0].data[0];
      let partList = [];
      let allData = getAllData(yAxis[i]);
      setPartMapList(yAxisPart, data, partList, allData, xLen);
      partList = partList.filter(item => item.name);
      setPartChildLen(partList, xLen);
      yPartList.push(partList);
    }
    let { leftMax, leftMin } = setYAxisMaxValue(yAxis, xKey, colorList, 'left', xAxisPart, chartType, xPartList);
    leftMaxValue = leftMax;
    leftMinValue = leftMin;
    let { rightMax, rightMin } = setYAxisMaxValue(yAxis, xKey, colorList, 'right', xAxisPart, chartType, xPartList);
    rightMaxValue = rightMax;
    rightMinValue = rightMin;
    yAxisNum = getYAxisNum(yPartList);
  }
  return {
    leftMaxValue,
    leftMinValue,
    rightMaxValue,
    rightMinValue,
    yPartList,
    yAxisNum
  };
};

const getAllData = (yAxisChild) => {
  let obj = {};
  for (let i = 0; i < yAxisChild.length; i++) {
    obj[yAxisChild[i].position] = yAxisChild[i].data;
  }
  return obj;
};

const setPartChildLen = (yPartList, key) => {
  if (!yPartList.length) return;
  for (let i = 0; i < yPartList.length; i++) {
    yPartList[i].len = getPartChild(yPartList[i], key);
    if (yPartList[i].children.length) {
      setPartChildLen(yPartList[i].children, key);
    }
  }
};

const getPartChild = (yPartChild, key) => {
  if (yPartChild.children.length) {
    let list = yPartChild.children;
    let len = 0;
    for (let i = 0; i < list.length; i++) {
      len = len + getPartChild(list[i], key);
    }
    return len;
  } else {
    return 1;
  }
};

const getYAxisNum = (list) => {
  let arr = [];
  getNum(list[0], arr);
  return arr.length;
};

const getNum = (list, arr) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].list) {
      arr.push('s');
      delete list[i].list;
    } else {
      getNum(list[i].children, arr);
    }
  }
};

const setPartMapList = (yAxisPart, data, partList, allData, xLen) => {
  let firstList = getUniqueList(yAxisPart[0].key[0], data);
  setPartMap(yAxisPart, 0, firstList, data, partList, allData, xLen);
};

const filterData = (allData, partKey, name) => {
  let tempObj = {};
  for (let key in allData) {
    let list = allData[key];
    tempObj[key] = [];
    for (let i = 0; i < list.length; i++) {
      let arr = [];
      for (let j = 0; j < list[i].length; j++) {
        if (list[i][j][partKey] === name) {
          arr.push(list[i][j]);
        }
      }
      tempObj[key].push(arr);
    }
  }
  return {
    allDataObj: tempObj,
    list: tempObj.left[0]
  };
};

// 生成顶部X轴的数据
const setPartMap = (yAxisPart, index, first, data, partList, allData, xLen) => {
  let partKey = yAxisPart[index].key[0];
  for (let i = 0, len = first.length; i < len; i++) {
    let name = first[i];
    let { allDataObj, list } = filterData(allData, partKey, name);
    partList.push({
      name,
      list: list,
      allDataObj: allDataObj,
      key: partKey,
      children: []
    });
  };
  if (!yAxisPart[index + 1]) return;
  setMorePartMap(yAxisPart, index + 1, partList, xLen);
};

const setMorePartMap = (yAxisPart, index, partList, xLen) => {
  let partKey = yAxisPart[index].key;
  for (let i = 0, len = partList.length; i < len; i++) {
    let data = partList[i].list;
    delete partList[i].list;
    let firstList = getUniqueList(partKey, data);
    setPartMap(yAxisPart, index, firstList, data, partList[i].children, partList[i].allDataObj, xLen);
  }
};

// 获取所有Y轴的最大值跟最小值
const setYAxisMaxValue = (yAxis, xKey, colorList, position, xAxisPart, chartType, xPartList) => {
  let maxArr = [];
  let minArr = [];
  for (let i = 0, len = yAxis.length; i < len; i++) {
    let axisObj = null;
    let leftLen = 0;
    if (position === 'left') {
      axisObj = yAxis[i][0];
    } else {
      axisObj = yAxis[i][1];
      leftLen = yAxis[i][0].key.length;
    }
    if (!axisObj) continue;
    let { max, min } = getMaxValue(axisObj, xKey, colorList, i, leftLen, null, xAxisPart, chartType, xPartList);
    maxArr.push(max);
    minArr.push(min);
  };
  let obj = {};
  let max = maxArr.length ? Math.max(...maxArr) : 0;
  let min = minArr.length ? Math.min(...minArr) : 0;
  obj[`${position}Max`] = isNaN(max) ? 0 : Number(max);
  obj[`${position}Min`] = isNaN(min) ? 0 : Number(min);
  return obj;
};

const isNoXPart = (xAxisPart, xKey, keyName, yPartChild) => {
  if (xKey === keyName) return false;
  if (yPartChild && yPartChild.key === keyName) {
    return false;
  };
  for (let i = 0; i < xAxisPart.length; i++) {
    if (xAxisPart[i].key === keyName) {
      return false;
    }
  }
  return true;
};

/*
  获取单个轴的最大值跟最小值
  axisObj: yAxis中的元素
  xKey: x轴的特征名
  xPartList: 顶部Y轴列表
  colorList: 颜色列表 (统一分类下，不同颜色值要相加成整数)
  index: yAxis中元素的下标
  leftLen: 左坐标轴的数量,如果是计算左坐标轴，那么leftLen传入值为0
*/
const getMaxValue = (
  axisObj,
  xKey,
  colorList,
  index,
  leftLen,
  yPartChild,
  xAxisPart,
  chartType,
  xPartList
) => {
  if (!axisObj) return [];
  let dataList = axisObj.data;
  let keyList = axisObj.key;
  let typeList = axisObj.type;
  let data = [];
  for (let i = 0, len = dataList.length; i < len; i++) {
    let keyId = `${index}-${leftLen + i}`;
    if (!chartType) chartType = typeList[i];
    let colorObj = colorList.filter(item => item.keyId === keyId)[0];
    // 如果有颜色分类，需要将统一分类下不同颜色的数值加起来
    if (chartType !== 'line' &&
        colorObj &&
        colorObj.type === 'ordinal' &&
        colorObj.feature &&
        isNoXPart(xAxisPart, xKey, colorObj.feature, yPartChild)) {
      data.push(...getOrdinal(dataList[i], keyList[i], xKey, yPartChild, xPartList, colorObj));
    } else {
      data.push(...getData(dataList[i], keyList[i], yPartChild));
    }
  }
  return {
    max: Math.max(...data),
    min: Math.min(...data)
  };
};

const setXPartData = (xPartList, data, xKey, key, list, colorObj) => {
  for (let i = 0; i < xPartList.length; i++) {
    if (xPartList[i].children.length) {
      let arr = list.filter(item => item[xPartList[i].key] === xPartList[i].name);
      setXPartData(xPartList[i].children, data, xKey, key, arr);
    } else {
      let arr = list.filter(item => item[xPartList[i].key] === xPartList[i].name);
      setAxisData(arr, data, xKey, key, colorObj);
    }
  }
};

const setAxisData = (list, data, xKey, key, colorObj) => {
  let xAxisList = [];
  let value = 0;
  let index = 0;
  for (let i = 0, len = list.length; i < len; i++) {
    if (!xAxisList.includes(list[i][xKey])) {
      if (index > 0) {
        data.push(value);
        index = 0;
      }
      xAxisList.push(list[i][xKey]);
      if (!isNaN(list[i][key])) {
        value = list[i][key];
      }
      index = index + 1;
    } else {
      let value1 = 0;
      if (!isNaN(list[i][key])) {
        value1 = list[i][key];
      }
      value = value + value1;
      index = index + 1;
    }
    if (i === len - 1) {
      data.push(value);
    }
  };
};

const getOrdinal = (list, key, xKey, yPartChild, xPartList, colorObj) => {
  let data = [];
  if (yPartChild) {
    list = list.filter(item => item[yPartChild.key] === yPartChild.name);
  }
  if (xPartList.length) {
    setXPartData(xPartList, data, xKey, key, list, colorObj);
  } else {
    setAxisData(list, data, xKey, key, colorObj);
  }
  return data;
};

const getData = (list, key, yPartChild) => {
  let data = [];
  if (yPartChild) {
    list = list.filter(item => item[yPartChild.key] === yPartChild.name);
  }
  for (let i = 0, len = list.length; i < len; i++) {
    if (!isNaN(list[i][key])) {
      data.push(list[i][key]);
    }
  }
  return data;
};

export {
  setYAxisPartList,
  getMaxValue,
  isNoXPart
};
