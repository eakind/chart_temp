import defaultConfig from '../../utils/defaultConfig';
// 根据key去重数据
const getUniqueList = (key, data) => {
  let list = [];
  for (let i = 0, len = data.length; i < len; i++) {
    list.push(data[i][key]);
  }
  return [...new Set(list)];
};

// 输入一组字符，返回最长元素的长度
const setMaxLen = (list) => {
  let num = 0;
  let text = '';
  for (let i = 0, len = list.length; i < len; i++) {
    let len = String(list[i].name).length;
    if (num < len) {
      num = len;
      text = String(list[i].name);
    }
  };
  return text;
};

// 输入data跟keyList, 返回最大值;
const getMaxValue = (data, keyList) => {
  let mergeList = [];
  for (let i = 0, len = keyList.length; i < len; i++) {
    for (let j = 0, len = data.length; j < len; j++) {
      if (!isNaN(data[j][keyList[i]])) {
        mergeList.push(data[j][keyList[i]]);
      }
    }
  }
  return Math.max(...mergeList);
};

const getMaxMinValue = (data, key) => {
  let arr = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (!isNaN(data[i][key])) {
      arr.push(data[i][key]);
    }
  }
  return {
    max: Math.max(...arr),
    min: Math.min(...arr)
  };
};

const getKeyDataList = (data, key) => {
  let list = [];
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i][key]) {
      list.push(data[i][key]);
    } else {
      if (data[i][key] === 0) {
        list.push(data[i][key]);
      }
    }
  }
  return list;
};

const setXAxisIndex = (data, name, key) => {
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i][key] !== name) {
      return i;
    }
  }
  return -1;
};

const setData = (data, feature, key, xAxisList, xAxis) => {
  let arr = [];
  let xKey = xAxis.key;
  for (let i = 0, len = xAxisList.length; i < len; i++) {
    let value = xAxisList[i].name;
    let oneObj = {};
    let keyData = [];
    let index = setXAxisIndex(data, value, xKey);
    if (index > 0) {
      let list = data.splice(0, index);
      for (let j = 0; j < list.length; j++) {
        oneObj[list[j][feature]] = list[j][key];
        keyData.push(list[j]);
      }
      oneObj.data = keyData;
      arr.push(oneObj);
    } else {
      if (arr[arr.length - 1].isEmpyt) continue;
      oneObj = {
        isEmpyt: true,
        data: []
      };
      arr.push(oneObj);
    }
  }
  let oneObj = {};
  let keyData = [];
  for (let j = 0; j < data.length; j++) {
    oneObj[data[j][feature]] = data[j][key];
    keyData.push(data[j]);
  }
  oneObj.data = keyData;
  arr.push(oneObj);
  return arr;
};

const setSeries = (list, feature) => {
  for (let i = 0; i < list.length; i++) {
    let key = list[i].key;
    for (let j = 0; j < list[i].length; j++) {
      list[i][j].data = setSeriesData(list[i][j].data.data, feature, key);
      if (isNaN(list[i][j][0])) {
        list[i][j][0] = 0;
      };
      if (isNaN(list[i][j][1])) {
        list[i][j][1] = list[i][j][0];
      };
    }
  }
};

const setSeriesData = (list, feature, key) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i][feature] === key) {
      return list[i];
    }
  }
  return {};
};

const setCateGory = (index) => {
  let category = defaultConfig.colorSet.category;
  let len = category.length;
  if (index < len) {
    return category[index];
  };
  let num = index % category.length;
  return category[num];
};

const setColorStack = (list) => {
  let colorStack = {};
  for (let i = 0; i < list.length; i++) {
    colorStack[list[i]] = {
      color: setCateGory(i),
      fillType: 'fill'
    };
  }
  return colorStack;
};

const combinedColor = (list, tempList) => {
  if (list instanceof Array) {
    return tempList;
  } else {
    return Object.assign(tempList, list);
  }
};

// const stackData = (list, keyArr) => {
//   let len = list.length;
//   let keyLen = keyArr.length;
//   // let arr = [];
//   for (let i = 0; i < keyLen; i++) {
//     let temp = [];
//     for (let j = 0; j < len; j++) {
//       let valArr = [];
//       if (i === 0) {
//         valArr.push(0);
//         valArr.push(list[j][keyArr[i]] || 0);
//         temp.push(valArr);
//       } else {
//       }
//     };
//     console.log(temp);
//     debugger;
//   }
//   for (let i = 0; i < len; i++) {
//     let obj = list[i];
//     for (let key in obj) {
//       console.log(key);
//     }
//   }
// };

// const setEmptyData = (series) => {
//   for (let i = 0; i < series.length; i++) {
//     for (let j = 0; j < series[i].length; j++) {
//       console.log(series[i][j].data);
//       debugger;
//     }
//   }
// };

const drawStackData = (data, colorObj, xAxisList, xAxis, allData) => {
  let keyArr = [...new Set(getKeyDataList(allData, colorObj.feature))];
  let drawData = setData(data, colorObj.feature, colorObj.key, xAxisList, xAxis);
  // let series = stackData(drawData, keyArr);
  const stack = d3.stack().keys(keyArr).order(d3.stackOrderNone).offset(d3.stackOffsetDiverging);
  let series = stack(drawData);
  setSeries(series, colorObj.feature);
  // setEmptyData(series);
  let list = colorObj.list;
  let tempList = setColorStack(keyArr);
  let colorStack = combinedColor(list, tempList); // Object.keys(list).length ? list : ;
  return {
    list: series,
    colorStack: colorStack
  };
};

const setLineData = (data, feature, key, keyArr, xAxis, xAxisList, xAxisPart) => {
  let arr = [];
  let xKey = xAxis.key;
  let topKey = null;
  let topList = [];
  if (xAxisPart.length) {
    topKey = xAxisPart[xAxisPart.length - 1].key;
    topList = getTopList(data, xAxisPart);
  }
  for (let i = 0, len = keyArr.length; i < len; i++) {
    let oneObj = {};
    let list = data.filter(item => item[feature] === keyArr[i]);
    list = setListData(list, xKey, xAxisList);
    cutList(list, xKey);
    oneObj.key = feature;
    oneObj.data = setPositionItem(list, xAxisList, topList, xKey, topKey);
    arr.push(oneObj);
  }
  return arr;
};

const setPositionItem = (list, xAxisList, topList, xKey, topKey) => {
  if (!topKey) return list;
  let index = 0;
  for (let i = 0; i < xAxisList.length; i++) {
    if (list[i].isPart) {
      index = index + 1;
    }
    xAxisList[i][topKey] = topList[index];
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i][topKey] && list[i][topKey] !== xAxisList[i][topKey]) {
      let obj = JSON.parse(JSON.stringify(list[i]));
      let listIndex = 0;
      for (let j = 0; j < xAxisList.length; j++) {
        if (obj[topKey] === xAxisList[j][topKey] && obj[xKey] === xAxisList[j].name) {
          listIndex = j;
        }
      };
      list[i] = JSON.parse(JSON.stringify(list[listIndex]));
      list[listIndex] = obj;
    }
  }
  return list;
};

const getTopList = (data, xAxisPart) => {
  let arr = [];
  let key = xAxisPart[xAxisPart.length - 1].key;
  for (let i = 0; i < data.length; i++) {
    arr.push(data[i][key]);
  }
  arr = [...new Set(arr)];
  return arr;
};

const cutList = (list, key) => {
  let uniqueList = [];
  for (let i = 0, len = list.length; i < len; i++) {
    if (uniqueList.includes(list[i][key])) {
      list[i].isPart = true;
      uniqueList = [];
    }
    uniqueList.push(list[i][key]);
  }
};

const setListData = (list, xKey, xAxisList) => {
  for (let i = 0, len = xAxisList.length; i < len; i++) {
    if (!list[i] || list[i][xKey] !== xAxisList[i].name) {
      let obj = {};
      obj[xKey] = xAxisList[i].name;
      list.splice(i, 0, obj);
      setListData(list, xKey, xAxisList);
      break;
    };
  }
  return list;
};

const drawStackLineData = (data, colorObj, xAxis, xAxisList, xAxisPart, allData) => {
  let keyArr = [...new Set(getKeyDataList(allData, colorObj.feature))];
  let drawData = setLineData(data, colorObj.feature, colorObj.key, keyArr, xAxis, xAxisList, xAxisPart);
  let list = colorObj.list;
  let tempList = setColorStack(keyArr);
  let colorStack = combinedColor(list, tempList);
  return {
    list: drawData,
    colorStack: colorStack
  };
};

export {
  getUniqueList,
  setMaxLen,
  getMaxValue,
  drawStackData,
  getMaxMinValue,
  drawStackLineData
};
