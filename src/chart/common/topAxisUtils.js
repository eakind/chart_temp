import { setTxt } from '../common/utils';
const getTopTitle = (xAxis, xAxisPart) => {
  let titleArr = [];
  for (let i = 0; i < xAxisPart.length; i++) {
    titleArr.push(xAxisPart[i].title.value);
  }
  titleArr.push(xAxis.title.value);
  return titleArr.join('/');
};

const createTopAxis = (middle, shapeHeight, shapeWidth, bandwidth, xPartList, xAxisPart, topTitle, isMobile) => {
  let topAxis = middle.append('g').attr('class', 'top-axis');
  let topGap = isMobile ? 50 : 20;
  createTopAxisTitle(topAxis, xAxisPart[xPartList[0].index], shapeWidth, topGap, topTitle, isMobile);
  let start = 0;
  let isFirst = true;
  for (let i = 0, len = xPartList.length; i < len; i++) {
    if (i > 0) start = start + xPartList[i - 1].len;
    // if (i === len - 1) isLast = true;
    initTopAxis(topAxis, xPartList[i], 0, topGap, xAxisPart, bandwidth, start, shapeHeight, isFirst, isMobile);
    isFirst = false;
  };
};

const createTopAxisTitle = (topAxis, xAxisPart, shapeWidth, topGap, topTitle, isMobile) => {
  let { style, show } = xAxisPart.title;
  let opacity = show ? 1 : 0;
  topAxis.append('text')
    .attr('transform', `translate(${shapeWidth / 2}, ${isMobile ? topGap - 15 : topGap})`)
    .attr('fill', style.fontColor)
    .attr('font-size', style.fontSize)
    .attr('text-anchor', 'middle')
    .attr('opacity', opacity)
    .text(() => {
      return setTxt(shapeWidth, topTitle, style.fontSize);
    });
};

const initTopAxis = (topAxis, xPartChild, layoutIndex, topGap, xAxisPart, bandwidth, start, shapeHeight, isFirst, isMobile) => {
  let unitWidth = xPartChild.len * bandwidth;
  let width = unitWidth / 2 + bandwidth * start;
  let unitBand = unitWidth;
  let lineWidth = bandwidth * start + 1;
  let style = xAxisPart[xPartChild.index].label.style;
  let grid = xAxisPart[xPartChild.index].grid.line.style;
  let unitHeight = isMobile ? 40 : 30;
  let firstHeight = 25;
  let index = xPartChild.index;
  let rotate = xAxisPart[xPartChild.index].label.style.rotate;
  if (rotate === 90 && xPartChild.index === 0) {
    firstHeight = 25;
    unitWidth = 70;
  }
  if (index) {
    rotate = xAxisPart[index - 1].label.style.rotate;
    unitWidth = 70;
  }
  if (rotate === 90) {
    unitHeight = 70;
  }
  let height = layoutIndex * unitHeight + firstHeight + topGap;
  topAxis.append('text')
    .attr('transform', `translate(${width}, ${height}) rotate(${style.rotate})`)
    .attr('fill', style.fontColor)
    .attr('text-anchor', 'middle')
    .attr('font-size', style.fontSize)
    .text(() => {
      if (unitBand < 20) return '.';
      return setTxt(unitWidth, xPartChild.name, style.fontSize, true);
    })
    .append('title')
    .text(xPartChild.name);
  let y1 = isMobile ? layoutIndex * (unitHeight + 10) + (firstHeight + 15) : layoutIndex * unitHeight + firstHeight;
  topAxis.append('line')
    .attr('x1', lineWidth)
    .attr('y1', y1)
    .attr('x2', lineWidth)
    .attr('y2', (shapeHeight - layoutIndex * unitHeight + firstHeight))
    .attr('opacity', isFirst ? 0 : 1)
    .attr('stroke', grid.fontColor)
    .attr('stroke-width', grid.lineWidth);
  if (xPartChild.children.length) {
    let list = xPartChild.children;
    let childStart = start;
    let childIsFirst = true;
    for (let i = 0, len = list.length; i < len; i++) {
      if (i > 0) childStart = childStart + list[i - 1].len;
      // if (i === len - 1) childIsLast = true;
      initTopAxis(topAxis, list[i], layoutIndex + 1, topGap, xAxisPart, bandwidth, childStart, shapeHeight, childIsFirst, isMobile);
      childIsFirst = false;
    }
  }
};

const createRotatedTopAxis = (middle, shapeHeight, bottomAxisHeight, bandwidth, xPartList, xAxisPart, topTitle) => {
  let topAxis = middle.append('g').attr('class', 'top-axis');
  let topGap = 20;
  let start = 0;
  let isFirst = true;
  for (let i = 0, len = xPartList.length; i < len; i++) {
    if (i > 0) start = start + xPartList[i - 1].len;
    // if (i === len - 1) isLast = true;
    initRotatedTopAxis(topAxis, xPartList[i], 0, topGap, xAxisPart, bandwidth, start, shapeHeight, bottomAxisHeight, isFirst);
    isFirst = false;
  };
};

const initRotatedTopAxis = (topAxis, xPartChild, layoutIndex, topGap, xAxisPart, bandwidth, start, shapeHeight, bottomAxisHeight, isFirst) => {
  let height = layoutIndex * 40 + 35 + topGap;
  let unitWidth = xPartChild.len * bandwidth - 4;
  let width = unitWidth / 2 + bandwidth * start;
  let lineWidth = bandwidth * start + 1; // unitWidth + bandwidth * start;
  let style = xAxisPart.label.style;
  let grid = xAxisPart.grid.line.style;
  topAxis.append('text')
    .attr('transform', `translate(${height - 20}, ${width})`)
    .attr('fill', style.fontColor)
    .attr('text-anchor', 'middle')
    .attr('writing-mode', 'tb')
    .attr('font-size', style.fontSize)
    .text(setTxt(unitWidth, xPartChild.name, style.fontSize, true));
  initVerLine(topAxis, height, shapeHeight * start, 0, grid);
  topAxis.append('line')
    .attr('y1', lineWidth)
    .attr('x1', height - 40)
    .attr('y2', lineWidth)
    .attr('x2', shapeHeight + bottomAxisHeight)
    .attr('opacity', isFirst ? 0 : 1)
    .attr('stroke', grid.fontColor)
    .attr('stroke-width', grid.lineWidth);
  if (xPartChild.children.length) {
    let list = xPartChild.children;
    let childStart = start;
    let childIsFirst = true;
    for (let i = 0, len = list.length; i < len; i++) {
      if (i > 0) childStart = childStart + list[i - 1].len;
      // if (i === len - 1) childIsLast = true;
      initRotatedTopAxis(topAxis, list[i], layoutIndex + 1, topGap, xAxisPart, bandwidth, childStart, shapeHeight, childIsFirst);
      childIsFirst = false;
    }
  }
};

const initVerLine = (leftPart, width, shapeHeight, topAxisHeight, grid) => {
  leftPart.append('line')
    .attr('x1', width)
    .attr('y1', topAxisHeight)
    .attr('x2', width)
    .attr('y2', shapeHeight + topAxisHeight)
    .attr('stroke', grid.fontColor)
    .attr('stroke-width', grid.lineWidth);
};

export {
  createTopAxis,
  getTopTitle,
  createRotatedTopAxis
};
