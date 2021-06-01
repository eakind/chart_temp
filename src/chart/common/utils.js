import { getTxtWidth } from '../../utils/utils';
import { getTxtHeight } from './containerUtils';

// 输入刻度值区域跟刻度数 返回刻度值数组
const setTickValues = (domain, counts) => {
  if (!counts) return null;
  let tickArray = [];
  let gapNum = (domain[1] - domain[0]) / counts;
  let gap = (gapNum > 10) ? Math.ceil(gapNum) : gapNum;
  if (domain[1] > 0) {
    for (let i = 0; i <= counts; i++) {
      tickArray.push(domain[0] + gap * i);
    }
  } else {
    for (let i = 0; i <= counts - 1; i++) {
      tickArray.push(domain[0] + gap * i);
    }
    tickArray.push(0);
  }
  return tickArray;
};

// 输入宽度跟字体大小，返回能显示的文字个数
const getTxtLen = (width, font) => {
  let textDom = document.createElement('div');
  textDom.style.width = width + 'px';
  textDom.style.fontSize = font + 'px';
  textDom.style.overflow = 'hidden';
  textDom.style.textOverflow = 'ellipsis';
  textDom.style.whiteSpace = 'nowrap';
  let txt = '';
  for (let i = 1; i < width; i++) {
    txt = txt + '哈';
    textDom.innerText = txt;
    document.body.appendChild(textDom);
    if (textDom.scrollWidth > textDom.offsetWidth) {
      document.body.removeChild(textDom);
      return i;
    };
    document.body.removeChild(textDom);
  }
  return -1;
};

const setTxt = (unitWidth, name, fontSize, isPart) => {
  if (unitWidth > 35 && unitWidth <= 55) return `${name.slice(0, 1)}..`;
  if (unitWidth <= 35 && unitWidth > 25) return '...';
  if (unitWidth < 25) return '.';
  let len = getTxtWidth(name, fontSize);
  if (len < unitWidth - 35) return name;
  let getLen = isPart ? unitWidth - 35 : unitWidth - 35;
  let fullLen = getTxtLen(getLen, fontSize) - 1;
  if (fullLen >= name.length) return name;
  return `${name.slice(0, fullLen)}..`;
};

const setHTxt = (unitWidth, name, fontSize) => {
  let height = getTxtHeight(name, fontSize);
  if (height > unitWidth + 5) return '.';
  return name;
};

const getToTalBar = (yAxis) => {
  let index = 0;
  for (let i = 0; i < yAxis.length; i++) {
    for (let j = 0; j < yAxis[i].key.length; j++) {
      if (yAxis[i].type[j] === 'bar') {
        index++;
      }
    }
  }
  return index;
};

const judeTxt = (perNode, node) => {
  let perRect = perNode.getBoundingClientRect();
  let nodeRect = node.getBoundingClientRect();
  if (perRect.right + 10 > nodeRect.left) {
    return false;
  }
  return true;
};

export {
  setTickValues,
  getTxtLen,
  getToTalBar,
  setTxt,
  setHTxt,
  judeTxt
};
