
import { getUniqueList, setMaxLen } from './dataUtils';
const setXAxisPartList = (xAxisPart, key, data) => {
  let xAxisPartLen = xAxisPart.length;
  let xAxisList = [];
  let maxXAxisLen = '';
  let xPartList = [];
  // let partKey = [];
  if (!xAxisPartLen) {
    let { list, maxTxt } = setXAxisList(key, data);
    xAxisList = list;
    maxXAxisLen = maxTxt;
  } else {
    let firstList = getUniqueList(xAxisPart[0].key, data);
    setPartMap(xAxisPart, 0, firstList, data, xPartList, key);
    setPartChildLen(xPartList, key);
    setXAxisListForMap(xPartList, xAxisList, key);
    maxXAxisLen = setMaxLen(xAxisList);
    // partKey = xAxisPart[xAxisPartLen - 1].key;
  }
  return { xAxisList, maxXAxisLen, xPartList };
};

const setUniqueArr = (list, key) => {
  let uniqueList = getUniqueList(key, list);
  return uniqueList.length;
};

const getPartChild = (xPartChild, key) => {
  if (xPartChild.children.length) {
    let list = xPartChild.children;
    let len = 0;
    for (let i = 0; i < list.length; i++) {
      len = len + getPartChild(list[i], key);
    }
    return len;
  } else {
    return setUniqueArr(xPartChild.list, key);
  }
};

const setPartChildLen = (xPartList, key) => {
  if (!xPartList.length) return;
  for (let i = 0; i < xPartList.length; i++) {
    xPartList[i].len = getPartChild(xPartList[i], key);
    if (xPartList[i].children.length) {
      setPartChildLen(xPartList[i].children, key);
    }
  }
};

const setXAxisListForMap = (xPartList, xAxisList, key) => {
  for (let i = 0, len = xPartList.length; i < len; i++) {
    if (xPartList[i].list) {
      let uniqueList = getUniqueList(key, xPartList[i].list);
      for (let j = 0; j < uniqueList.length; j++) {
        xAxisList.push({
          name: uniqueList[j] // [key]
        });
      }
    } else {
      setXAxisListForMap(xPartList[i].children, xAxisList, key);
    }
  }
};

const setXAxisList = (key, data) => {
  let list = [];
  let temp = []; // 方便用来去重
  let maxLen = 0;
  let maxTxt = '';
  for (let i = 0, len = data.length; i < len; i++) {
    if (!temp.includes(data[i][key])) {
      let name = data[i][key];
      let length = getStrLen(name);
      if (maxLen < length) {
        maxLen = length;
        maxTxt = name;
      }
      list.push({
        name
      });
      temp.push(name);
    }
  }
  return {
    list,
    maxTxt
  };
};

const getStrLen = (str) => {
  var l = str.length;
  var blen = 0;
  for (let i = 0; i < l; i++) {
    if ((str.charCodeAt(i) & 0xff00) !== 0) {
      blen++;
    }
    blen++;
  }
  return blen;
};

// 生成顶部X轴的数据
const setPartMap = (xAxisPart, index, first, data, xPartList, key) => {
  let partKey = xAxisPart[index].key;
  for (let i = 0, len = first.length; i < len; i++) {
    let name = first[i];
    let list = [];
    for (let j = 0, dataLen = data.length; j < dataLen; j++) {
      if (data[j][partKey] === name) {
        list.push(data[j]);
      }
    }
    xPartList.push({
      name,
      list,
      key: partKey,
      children: [],
      index: index
    });
  };
  if (!xAxisPart[index + 1]) return;
  setMorePartMap(xAxisPart, index + 1, xPartList, key);
};

const setMorePartMap = (xAxisPart, index, xPartList, key) => {
  let partKey = xAxisPart[index].key;
  for (let i = 0, len = xPartList.length; i < len; i++) {
    let data = xPartList[i].list;
    delete xPartList[i].list;
    let firstList = getUniqueList(partKey, data);
    setPartMap(xAxisPart, index, firstList, data, xPartList[i].children, key);
  }
};

export {
  setXAxisPartList
};
