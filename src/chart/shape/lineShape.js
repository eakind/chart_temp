import { hideTooltip, showTooltip } from './tooltip';
import { hasColorFeature } from '../../utils/utils';
import { drawStackLineData } from '../common/dataUtils';
import { drawClipPath } from '../common/containerUtils';
import { drawLabel, filterLabel } from './label';
const drawLineShape = (
  parentMiddle,
  middle,
  labelContainer,
  data,
  scaleY,
  bandwidth,
  height,
  topAxisHeight,
  key,
  colorList,
  xAxisList,
  xAxis,
  xAxisPart,
  lineStyle,
  size,
  tooltipList,
  labelsList,
  keyId,
  // partKey,
  allData,
  yPartChild,
  click,
  id,
  shapeWidth,
  yAxisHeight,
  index,
  start
) => {
  let colorObj = hasColorFeature(colorList, key, keyId);
  // let isNoPart = isNoXPart(xAxisPart, xAxis.key, colorObj.feature, yPartChild);
  let lineData = JSON.parse(JSON.stringify(data));
  let allLineData = JSON.parse(JSON.stringify(allData));
  let dataList = [];
  if (colorObj.type === 'ordinal') {
    let { list, colorStack } = drawStackLineData(lineData, colorObj, xAxis, xAxisList, xAxisPart, allLineData);
    colorObj.list = colorStack;
    dataList = list;
  } else {
    dataList = [{
      data: data
    }];
  }
  const symbols = {
    circle: d3.symbolCircle,
    cross: d3.symbolCross,
    cross45: d3.symbolCross,
    triangle: d3.symbolTriangle,
    triangle180: d3.symbolTriangle,
    square: d3.symbolSquare,
    star: d3.symbolStar,
    diamond: d3.symbolDiamond,
    wye: d3.symbolWye
  };
  const rotateds = {
    cross45: 45,
    triangle180: 180
  };
  let strokeWidth = 4 * size;
  let arc = d3.symbol().type(symbols[lineStyle]).size(strokeWidth * 25);
  let rotated = rotateds[lineStyle] || 0;
  let valueLine = d3.line()
    .defined((d) => {
      if (!d) return '';
      if (d[key] === null) return '';
      if (isNaN(d[key])) return '';
      return d;
    })
    .x((d) => {
      return bandwidth * d.index + bandwidth / 2;
    })
    .y((d) => {
      return scaleY(isNaN(d[key]) ? null : d[key]);
    });
  for (let i = 0, len = dataList.length; i < len; i++) {
    let lineContainter = middle.append('g').attr('transform', `translate(0,${height})`).attr('class', `shape-${keyId}`);
    drawClipPath(lineContainter, shapeWidth, yAxisHeight, index, start, id);
    lineContainter = lineContainter.append('g');
    let data = setData(xAxisPart, dataList[i].data);
    drawLine(lineContainter, valueLine, strokeWidth, data, colorObj, key);
    drawShape(parentMiddle, lineContainter, arc, data, colorObj, bandwidth, key, scaleY, rotated, tooltipList, click);
    drawLabel(
      labelContainer,
      data,
      scaleY,
      bandwidth,
      height,
      topAxisHeight,
      size,
      0,
      1,
      key,
      keyId,
      labelsList,
      tooltipList,
      false,
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
  filterLabel(id);
};

const setData = (xAxisPart, data) => {
  let arr = [];
  if (xAxisPart.length) {
    let parkeyArr = [];
    for (let i = 0; i < xAxisPart.length; i++) {
      parkeyArr.push(xAxisPart[i].key);
    };
    let currentName = setCurrentName(data[0], parkeyArr);
    for (let i = 0; i < data.length; i++) {
      let obj = JSON.parse(JSON.stringify(data[i]));
      if (!currentName) {
        arr.push(null);
        currentName = setCurrentName(data[i], parkeyArr);
      }
      if (currentName !== setCurrentName(data[i], parkeyArr)) {
        arr.push(null);
        currentName = setCurrentName(data[i], parkeyArr);
      }
      obj.index = i;
      arr.push(obj);
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      let obj = data[i];
      obj.index = i;
      arr.push(obj);
    }
  }
  return arr;
};

const setCurrentName = (dataObj, parkey) => {
  let name = '';
  for (let i = 0; i < parkey.length; i++) {
    name = name + dataObj[parkey[i]];
  }
  return name;
};

const drawShape = (parentMiddle, lineContainter, arc, data, colorObj, bandwidth, key, scaleY, rotated, tooltipList, click) => {
  let pointer = lineContainter.selectAll('.point-group')
    .data(data.filter(item => item && !isNaN(item[key]) && item[key] !== null))
    .enter()
    .append('g');

  pointer.append('path')
    .attr('class', 'line-dot')
    .attr('d', arc)
    .attr('transform', (d) => {
      if (!d) return;
      if (isNaN(d[key])) return '';
      if (d[key] === null) return '';
      let x = bandwidth * d.index + bandwidth / 2;
      let y = scaleY(isNaN(d[key]) ? 0 : d[key]);
      return `translate(${x}, ${y}) rotate(${rotated})`;
    })
    .attr('fill', (d) => {
      let color = colorObj.color || '#4284f5';
      if (!d) return color;
      if (d[colorObj.feature]) {
        color = colorObj.list[d[colorObj.feature]].color;
      }
      return color;
    })
    .attr('opacity', colorObj.opacity / 100 || 1)
    .on('mouseenter', (d) => {
      showTooltip(d, tooltipList);
    })
    .on('mouseout', () => {
      hideTooltip();
    })
    .on('click', function (d) {
      parentMiddle.selectAll('.bar').attr('opacity', 0.2);
      parentMiddle.selectAll('.line-path').attr('opacity', 0.2);
      parentMiddle.selectAll('.line-dot').attr('opacity', 0.2);
      parentMiddle.selectAll('.label').attr('opacity', 0.2);
      d3.select(this).attr('opacity', 1);
      click(d);
    });
};

const drawLine = (lineContainter, valueLine, strokeWidth, data, colorObj, key) => {
  let dataObj = data.filter(item => item && !isNaN(item[key]) && item[key] !== null)[0];
  lineContainter.append('path')
    .data(data.filter(item => item && !isNaN(item[key]) && item[key] !== null))
    .attr('class', 'line-path')
    .attr('d', valueLine(data))
    .attr('fill', 'none')
    .attr('stroke-width', strokeWidth)
    .attr('stroke', (d) => {
      let color = colorObj.color || '#4284f5';
      if (!dataObj) return color;
      if (dataObj[colorObj.feature]) {
        let key = dataObj[colorObj.feature];
        color = colorObj.list[key].color;
      }
      return color;
    })
    .attr('opacity', colorObj.opacity / 100 || 1);
};

export {
  drawLineShape
};
