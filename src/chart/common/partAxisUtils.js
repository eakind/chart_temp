import { setTxt } from './utils';
const createPartTxt = (leftPart, yPartChild, yAxisPartChild, yAxisHeight, topAxisHeight, width, start) => {
  let oneHeight = yPartChild.len * yAxisHeight;
  let height = oneHeight / 2 + yAxisHeight * start + topAxisHeight;
  let { style } = yAxisPartChild.title;
  leftPart.append('text')
    .attr('transform', `translate(${width}, ${height})`)
    .attr('fill', style.fontColor)
    .attr('text-anchor', 'middle')
    .attr('font-size', style.fontSize)
    .style('writing-mode', 'tb')
    .text(() => {
      return setTxt(oneHeight, yPartChild.name, style.fontSize, true);
    })
    .append('title')
    .text(yPartChild.name);
};

const createPartLine = (leftPart, yPartChild, yAxisPartChild, yAxisHeight, topAxisHeight, width, shapeWidth, start, isLast) => {
  let lineHeight = yPartChild.len * yAxisHeight + yAxisHeight * start + topAxisHeight;
  let { style } = yAxisPartChild.grid.line;
  leftPart.append('line')
    .attr('x1', width - 20)
    .attr('y1', lineHeight)
    .attr('x2', shapeWidth)
    .attr('y2', lineHeight)
    .attr('opacity', isLast ? 0 : 1)
    .attr('stroke', style.fontColor)
    .attr('stroke-width', style.lineWidth || 1);
};

const initVerLine = (leftPart, width, shapeHeight, topAxisHeight, yAxisPartChild) => {
  let { style } = yAxisPartChild.grid.line;
  leftPart.append('line')
    .attr('x1', width + 20)
    .attr('y1', topAxisHeight)
    .attr('x2', width + 20)
    .attr('y2', shapeHeight + topAxisHeight)
    .attr('stroke', style.fontColor)
    .attr('stroke-width', style.lineWidth);
};

const drawBottomLine = (middle, shapeWidth, yAxisHeight, topAxisHeight, start, xAxis) => {
  let height = topAxisHeight + yAxisHeight * start;
  let opacity = xAxis.line.show ? 1 : 0;
  let lineColor = xAxis.line.style.fontColor;
  let lineWidth = xAxis.line.style.lineWidth;
  middle.append('line')
    .attr('x1', 0)
    .attr('x2', shapeWidth)
    .attr('y1', height)
    .attr('y2', height)
    .attr('stroke', lineColor)
    .attr('opacity', opacity)
    .attr('stroke-width', lineWidth);
};

const createRotatedPartTxt = (leftPart, yPartChild, yAxisPartChild, yAxisHeight, bottomAxisHeight, width, start) => {
  let height = yPartChild.len * yAxisHeight / 2 + yAxisHeight * start + bottomAxisHeight;
  let style = yAxisPartChild.title.style;
  let oneHeight = yPartChild.len * yAxisHeight;
  leftPart.append('text')
    .attr('transform', `translate(${height}, ${width})`)
    .attr('fill', style.fontColor)
    .attr('text-anchor', 'middle')
    .attr('font-size', style.fontSize)
    .text(setTxt(oneHeight, yPartChild.name, style.fontSize, true));
};

const createRotatedPartLine = (leftPart, yPartChild, yAxisHeight, bottomAxisHeight, width, shapeWidth, start, isLast, yAxisPartChild) => {
  let lineHeight = yPartChild.len * yAxisHeight + yAxisHeight * start + bottomAxisHeight;
  let lineStyle = yAxisPartChild.grid.line.style;
  leftPart.append('line')
    .attr('y1', width - 20)
    .attr('x1', lineHeight)
    .attr('y2', shapeWidth)
    .attr('x2', lineHeight)
    .attr('opacity', isLast ? 0 : 1)
    .attr('stroke', lineStyle.fontColor)
    .attr('stroke-width', lineStyle.lineWidth);
};

const initRotatedVerLine = (leftPart, width, shapeHeight, bottomAxisHeight, yAxisPartChild) => {
  let lineStyle = yAxisPartChild.grid.line.style;
  leftPart.append('line')
    .attr('y1', width + 20)
    .attr('x1', bottomAxisHeight)
    .attr('y2', width + 20)
    .attr('x2', shapeHeight + bottomAxisHeight)
    .attr('stroke', lineStyle.fontColor)
    .attr('stroke-width', lineStyle.lineWidth);
};

const drawRotatedBottomLine = (middle, shapeWidth, yAxisHeight, bottomAxisHeight, start, yAxisPartChild) => {
  let height = bottomAxisHeight + yAxisHeight * start;
  let lineStyle = yAxisPartChild.line.style;
  middle.append('line')
    .attr('y1', 0)
    .attr('y2', shapeWidth)
    .attr('x1', height)
    .attr('x2', height)
    .attr('stroke', lineStyle.fontColor)
    .attr('stroke-width', lineStyle.lineWidth);
};

export {
  createPartTxt,
  createPartLine,
  initVerLine,
  drawBottomLine,
  createRotatedPartTxt,
  createRotatedPartLine,
  initRotatedVerLine,
  drawRotatedBottomLine
};
