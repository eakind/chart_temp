import { showTooltip, hideTooltip } from './tooltip';
import { hasColorFeature } from '../../utils/utils';
import { drawStackData } from '../common/dataUtils';
import { barColor, stackBarColor, setLinearList } from '../common/shapeUtils';
import { isNoXPart } from '../common/yAxisDataUtils';
import { drawLabel } from './label';
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
  xAxisPart,
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
  let colorObj = hasColorFeature(colorList, key, keyId, xAxisPart);
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
    .attr('transform', `translate(0,${topAxisHeight})`)
    .attr('class', `shape-${keyId}`);
  drawClipPath(barContainer, shapeWidth, yAxisHeight, index, start, id);
  barContainer.append('g');
  let bar = barContainer.selectAll(`bar_${num}`).data(data);
  let barWidth = (bandwidth * size) / total; // / (total * 2);
  let gap = (bandwidth - barWidth * total) / 2;
  if (barWidth > total * 2) {
    barWidth = barWidth - total * 2;
  }
  bar.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 2)) + gap;
    })
    .attr('y', (d) => {
      if (!d[key]) return scaleY(0);
      return scaleY(Math.max(d[key], 0));
    })
    .attr('opacity', colorObj.opacity / 100 || 1)
    .attr('width', barWidth)
    .attr('height', (d) => {
      if (!d[key]) return 0;
      return Math.abs(scaleY(d[key]) - scaleY(0));
    })
    .attr('fill', function (d) {
      return barColor(middle, colorObj, d);
    })
    .attr('stroke-width', 1)
    .attr('stroke', (d) => {
      return barColor(middle, colorObj, d, true);
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
      parentMiddle.selectAll('.line-path').attr('opacity', 0.2);
      parentMiddle.selectAll('.line-dot').attr('opacity', 0.2);
      d3.select(this).attr('opacity', 1);
      click(d);
    });
  drawLabel(
    labelContainer,
    data,
    scaleY,
    bandwidth,
    topAxisHeight,
    height,
    size,
    num,
    total,
    key,
    keyId,
    labelsList,
    tooltipList,
    false,
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
  let barWidth = (bandwidth / total) * size;
  let gap = (bandwidth - barWidth * total) / 2;
  let barContainer = middle.append('g')
    .attr('transform', `translate(0,${topAxisHeight})`)
    .attr('class', `shape-${keyId}`);
  drawClipPath(barContainer, shapeWidth, yAxisHeight, index, start, id);
  barContainer.append('g');
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
    .attr('x', (d, index) => {
      return (index * bandwidth) + (num * (barWidth + 2)) + gap;
    })
    .attr('y', (d, index) => {
      if (scaleY(d[1]) - scaleY(d[0]) > 0) {
        return scaleY(d[0]);
      } else {
        return scaleY(d[1]);
      }
    })
    .attr('width', barWidth)
    .attr('stroke-width', 1)
    .attr('stroke', (d) => {
      let color = '#4284f5';
      if (d.data[colorObj.feature]) {
        color = colorStack[d.data[colorObj.feature]].color;
      }
      return color;
    })
    .attr('fill', (d) => {
      let color = '#4284f5';
      let fillType = 'fill';
      if (d.data[colorObj.feature]) {
        color = colorStack[d.data[colorObj.feature]].color;
        fillType = colorStack[d.data[colorObj.feature]].fillType;
      }
      return stackBarColor(middle, fillType, color);
    })
    .attr('opacity', colorObj.opacity / 100 || 1)
    .attr('height', (d) => {
      if (d.data['城市级别'] === '5线城市' && d.data['RFM类别'] === '中等价值用户' && d.data['区域'] === '西南区') {
        console.log(Math.max(scaleY(d[0]) - scaleY(d[1]), 0));
      }
      if (scaleY(d[1]) - scaleY(d[0]) > 0) {
        return Math.max(scaleY(d[1]) - scaleY(d[0]), 0);
      } else {
        return Math.max(scaleY(d[0]) - scaleY(d[1]), 0);
      }
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
      parentMiddle.selectAll('.line-path').attr('opacity', 0.2);
      parentMiddle.selectAll('.line-dot').attr('opacity', 0.2);
      click(d);
      d3.select(this).attr('opacity', 1);
    }, true);
  drawLabel(
    labelContainer,
    list,
    scaleY,
    bandwidth,
    topAxisHeight,
    height,
    size,
    num,
    total,
    key,
    keyId,
    labelsList,
    tooltipList,
    true,
    false,
    click,
    colorObj,
    id,
    shapeWidth,
    yAxisHeight,
    index,
    start
  );
  return colorStack;
};

export {
  drawBarShape,
  drawStackBar
};
