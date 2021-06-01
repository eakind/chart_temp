/* 判断是否自适应宽高，设置画图空间 */
const setContainer = (id, isRotated, dpr) => {
  let dom = document.querySelector(`#${id}`);
  dom.innerHTML = '';
  let domWidth = dom.clientWidth;
  let domHeight = dom.clientHeight;
  let width = domWidth / dpr;
  let height = domHeight / dpr;
  if (isRotated) {
    height = height - 20;
    dom.style.display = 'flex';
  }
  return {
    width,
    height
  };
};

const removeContainer = (id) => {
  let dom = document.querySelector(`#${id}`);
  dom.innerHTML = '';
};

// 获取文本的高度
const getTxtHeight = (text, fontSize) => {
  let textDom = document.createElement('span');
  textDom.innerText = text;
  textDom.style.fontSize = fontSize + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let height = textDom.clientHeight;
  document.body.removeChild(textDom);
  return height;
};

// 获取文本的宽度
const getTxtWidth = (text, fontSize) => {
  let textDom = document.createElement('text');
  textDom.innerText = text;
  textDom.style.fontSize = fontSize + 'px';
  textDom.style.position = 'fixed';
  document.body.appendChild(textDom);
  let width = textDom.clientWidth;
  document.body.removeChild(textDom);
  return width;
};

const isDot = (isRotated, fitModel) => {
  if (isRotated) {
    if (fitModel === 'full' || fitModel === 'fitHeight') {
      return true;
    }
  } else {
    if (fitModel === 'full' || fitModel === 'fitWidth') {
      return true;
    }
  }
  return false;
};

const isFit = (isRotated, rotate, fitModel) => {
  if (isRotated) {
    if (fitModel === 'standard' || fitModel === 'fitWidth') {
      if (rotate === 45 || rotate === -45) {
        return true;
      }
    }
  } else {
    if (fitModel === 'standard' || fitModel === 'fitHeight') {
      if (rotate === 45 || rotate === -45) {
        return true;
      }
    }
  }
  return false;
};

// 设置底部标签的高度
const setBottomLabelWidth = (xAxis, maxXAxisLen, isRotated, xAxisList, fitModel, shapeWidth) => {
  let bandWidth = shapeWidth / xAxisList.length;
  let style = xAxis.label.style;
  let rotate = style.rotate;
  if (isDot(isRotated, fitModel)) {
    if (rotate === 90) {
      if (bandWidth < 14.5) {
        return 12;
      }
    } else {
      if (bandWidth < 20) {
        return 12;
      }
    }
  }
  let height = getTxtHeight(maxXAxisLen, style.fontSize);
  let width = getTxtWidth(maxXAxisLen, style.fontSize);
  let temp = 0;
  if (isRotated) temp = 90;
  if (rotate === temp) return height;
  if (isFit(isRotated, rotate, fitModel)) {
    return 75;
  }
  return width + 6;
};

// 设置顶部X轴的高度
const getTopAxisHeight = (xAxisPart, isMobile) => {
  if (!xAxisPart || xAxisPart.length === 0) return isMobile ? 20 : 15;
  else return isMobile ? (xAxisPart.length) * 55 + 20 : (xAxisPart.length) * 35 + 15;
};

// 设置标签高度
const setTitleHeight = (xAxis) => {
  let height = 0;
  let { show, style, value } = xAxis.title;
  if (!show) return height;
  height = height + getTxtHeight(value, style.fontSize);
  return height;
};

const createPattern = (middle, fillColor, type) => {
  let keyName = fillColor;
  if (fillColor.includes('(') || fillColor.includes(')')) {
    keyName = fillColor.split('(').join('').split(')').join('');
  }
  let pattern = middle.append('defs').append('pattern')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('id', `fill-${type}-${keyName}`)
    .attr('width', '6')
    .attr('height', '6');
  let g = pattern
    .append('g')
    .attr('fill-rule', 'evenodd')
    .attr('stroke-width', 1)
    .append('g')
    // .attr('class', `${CLASS.pattern}`)
    .attr('fill', fillColor || 'rgb(225, 127, 8)');

  switch (type) {
    case 'zuo':
      // 左斜纹
      g.append('polygon').attr('points', '6 5 6 6 5 6');
      g.append('polygon').attr('points', '5 0 6 0 0 6 0 5');
      break;
    case 'you':
      // 右斜纹
      g.append('polygon').attr('points', '6 0 6 1 5 0');
      g.append('polygon').attr('points', '0 0 6 6 5 6 0 1');
      break;
    case 'heng':
      // 横纹
      g.append('polygon').attr('points', '0 0 6 0 6 1 0 1');
      break;
    case 'shu':
      // 竖纹
      g.append('polygon').attr('points', '0 0 1 0 1 6 0 6');
      break;
    case 'ge':
      // 格子
      g.append('polygon').attr('points', '0 0 6 0 6 1 0 1');
      g.append('polygon').attr('points', '0 0 1 0 1 6 0 6');
      break;
    case 'zha':
      // 栅栏
      g.append('polygon').attr('points', '6 5 6 6 5 6');
      g.append('polygon').attr('points', '5 0 6 0 0 6 0 5');
      g.append('polygon').attr('points', '6 0 6 1 5 0');
      g.append('polygon').attr('points', '0 0 6 6 5 6 0 1');
      break;
    case 'fill':
      // 实填充
      g.append('polygon')
        .attr('points', '0 0 6 0 6 6 0 6')
        .attr('fill', fillColor);
      break;
    default:
      g.append('polygon');
  }
  return `url(#${pattern.node().id})`;
};

const drawClipPath = (container, shapeWidth, height, index, start, chartId) => {
  let id = `${chartId}-${index}-${start}`;
  container.append('clipPath')
    .attr('id', id)
    .append('rect')
    .attr('width', shapeWidth)
    .attr('height', height);
  container.attr('clip-path', `url(#${id})`);
};

export {
  setContainer,
  removeContainer,
  setBottomLabelWidth,
  getTxtHeight,
  getTxtWidth,
  getTopAxisHeight,
  setTitleHeight,
  createPattern,
  drawClipPath
};
