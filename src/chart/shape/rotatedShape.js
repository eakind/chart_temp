import { showTooltip, hideTooltip } from './tooltip';
import { hasColorFeature } from '../../utils/utils';
import { drawStackData } from '../common/dataUtils'; // getMaxMinValue
import { barColor, stackBarColor, setLinearList } from '../common/shapeUtils';
import { isNoXPart } from '../common/yAxisDataUtils';
import { drawRotatedLabel } from './label';
import { drawClipPath } from '../common/containerUtils';
const drawBarShape = (
  parentMiddle,
  middle,
  labelContainer,
  data,
  scaleY,
  bandwidth,
  height,
  topAxisHeight,
  num,
  total,
  key,
  colorList,
  xAxisList,
  xAxis,
  xAxisPart, // 顶部X轴信息
  size,
  tooltipList,
  labelsList,
  keyId,
  allData,
  yPartChild,
  format,
  click,
  id,
  shapeWidth,
  yAxisHeight,
  index,
  start
) => {
  let colorObj = hasColorFeature(colorList, key, keyId);
  let isNoPart = isNoXPart(xAxisPart, xAxis.key, colorObj.feature, yPartChild);
  if (colorObj.type === 'ordinal' && isNoPart) {
    let colorStack = drawStackBar(
      parentMiddle,
      middle,
      labelContainer,
      data,
      scaleY,
      bandwidth,
      height,
      topAxisHeight,
      num,
      total,
      key,
      keyId,
      colorObj,
      xAxisList,
      xAxis,
      size,
      tooltipList,
      labelsList,
      allData,
      click,
      id,
      shapeWidth,
      yAxisHeight,
      index,
      start
    );
    return colorStack;
  }
  if (colorObj.type === 'ordinal') {
    let { colorStack } = drawStackData(JSON.parse(JSON.stringify(data)), colorObj, xAxisList, xAxis, JSON.parse(JSON.stringify(allData)));
    colorObj.list = colorStack;
  }
  if (colorObj.type === 'linear') {
    colorObj.list = setLinearList(colorObj, data, format);
  }
  let barContainer = middle.append('g')
    .attr('transform', `translate(${topAxisHeight},${0})`)
    .attr('class', `shape-${keyId}`);
  drawClipPath(barContainer, yAxisHeight, shapeWidth, index, start, id);
  barContainer = barContainer.append('g');
  let bar = barContainer.selectAll(`bar_${num}`).data(data);
  let barWidth = (bandwidth / total) * size; // / (total * 2);
  let gap = (bandwidth - barWidth * total) / 2;
  if (barWidth > total * 2) {
    barWidth = barWidth - total * 2;
  }
  bar.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('y', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 2)) + gap;
    })
    .attr('x', (d) => {
      if (!d[key]) return scaleY(0);
      let keyNum = d[key];
      if (isNaN(keyNum)) return scaleY(0);
      if (keyNum > 0) {
        return scaleY(0);
      } else {
        return scaleY(keyNum);
      }
    })
    .attr('opacity', colorObj.opacity / 100 || 1)
    .attr('width', d => {
      if (!d[key]) return 0;
      let keyNum = d[key];
      if (isNaN(keyNum)) return 0;
      return Math.abs(scaleY(keyNum) - scaleY(0));
    })
    .attr('height', barWidth)
    .attr('stroke-width', 1)
    .attr('stroke', (d) => {
      return barColor(middle, colorObj, d, true);
    })
    .attr('fill', (d) => {
      return barColor(middle, colorObj, d);
    })
    .on('mouseout', (d) => {
      hideTooltip();
    })
    .on('mouseenter', (d) => {
      showTooltip(d, tooltipList);
    })
    .on('click', function (d, index) {
      parentMiddle.selectAll('.bar').attr('opacity', 0.2);
      parentMiddle.selectAll('.label').attr('opacity', 0.2);
      d3.select(this).attr('opacity', 1);
      click(d);
    });
  drawRotatedLabel(
    labelContainer,
    data,
    scaleY,
    bandwidth,
    size,
    topAxisHeight,
    height,
    num,
    total,
    key,
    keyId,
    labelsList,
    tooltipList,
    false,
    click,
    colorObj,
    id,
    shapeWidth,
    yAxisHeight,
    index,
    start
  );
};

const drawStackBar = (
  parentMiddle,
  middle,
  labelContainer,
  data,
  scaleY,
  bandwidth,
  height,
  topAxisHeight,
  num,
  total,
  key,
  keyId,
  colorObj,
  xAxisList,
  xAxis,
  size,
  tooltipList,
  labelsList,
  allData,
  click,
  id,
  shapeWidth,
  yAxisHeight,
  index,
  start
) => {
  let { list, colorStack } = drawStackData(data, colorObj, xAxisList, xAxis, allData);
  colorObj.list = colorStack;
  let barWidth = (bandwidth / total) * size; // / (total * 2);
  let gap = (bandwidth - barWidth * total) / 2;
  let barContainer = middle.append('g')
    .attr('transform', `translate(${topAxisHeight}, 0)`)
    .attr('class', `shape-${keyId}`);
  drawClipPath(barContainer, yAxisHeight, shapeWidth, index, start, id);
  barContainer = barContainer.append('g');
  let groupColor = barContainer.selectAll('group-color')
    .data(list)
    .enter().append('g')
    .attr('class', (d, index) => `group-${index}`);

  let categoryColor = groupColor.selectAll('category-color')
    .data(d => {
      return d;
    })
    .enter().append('g')
    .attr('class', (d, index) => `category-${index}`);
  categoryColor.append('rect')
    .attr('class', 'bar')
    .attr('y', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 1)) + gap;
    })
    .attr('x', (d) => {
      if (scaleY(d[1]) - scaleY(d[0]) > 0) {
        return scaleY(d[0]);
      } else {
        return scaleY(d[1]);
      }
    })
    .attr('opacity', colorObj.opacity / 100 || 1)
    .attr('stroke-width', 1)
    .attr('stroke', (d) => {
      let color = '#4284f5';
      if (d.data[colorObj.feature]) {
        color = colorStack[d.data[colorObj.feature]].color;
      }
      return color;
    })
    .attr('width', (d) => {
      if (scaleY(d[1]) - scaleY(d[0]) > 0) {
        return Math.max(scaleY(d[1]) - scaleY(d[0]), 0);
      } else {
        return Math.max(scaleY(d[0]) - scaleY(d[1]), 0);
      }
    })
    .attr('height', barWidth)
    .attr('fill', (d) => {
      let color = '#4284f5';
      let fillType = 'fill';
      if (d.data[colorObj.feature]) {
        color = colorStack[d.data[colorObj.feature]].color;
        fillType = colorStack[d.data[colorObj.feature]].fillType;
      }
      return stackBarColor(middle, fillType, color);
    })
    .on('mouseout', (d) => {
      hideTooltip();
    })
    .on('mouseenter', (d) => {
      showTooltip(d.data, tooltipList);
    })
    .on('click', function (d, index) {
      parentMiddle.selectAll('.bar').attr('opacity', 0.2);
      parentMiddle.selectAll('.label').attr('opacity', 0.2);
      d3.select(this).attr('opacity', 1);
      click(d.data);
    });
  drawRotatedLabel(
    labelContainer,
    list,
    scaleY,
    bandwidth,
    size,
    topAxisHeight,
    height,
    num,
    total,
    key,
    keyId,
    labelsList,
    tooltipList,
    true,
    click,
    colorObj,
    id,
    shapeWidth,
    yAxisHeight,
    index,
    start
  );
};

export {
  drawBarShape,
  drawStackBar
};
