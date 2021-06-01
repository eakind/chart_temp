import { setLineStyle } from './axisUtil';
import { getTxtWidth } from './containerUtils';
import { setTxt, setHTxt } from './utils';
const createBottomAxis = (middle, axis, height, isRotated) => {
  let axisInstance = middle.append('g')
    .attr('class', 'x-axis')
    .attr('transform', () => {
      return isRotated ? `translate(${height},${0})` : `translate(${0},${height})`;
    })
    .call(axis);
  return axisInstance;
};

const setBottomAxisStyle = (axisInstance, xAxis, bandwidth, shapeWidth, bottomAxisHeight, isRotated, rightAxis, rightMaxWidth, topTitle) => {
  let { line, label, title } = xAxis;
  // 设置线样式
  setLineStyle(axisInstance, line);
  // 设置标签的样式
  setLabelStyle(axisInstance, label, bandwidth, isRotated);
  // 设置tooltip
  setTooltip(axisInstance);
  // 设置标题
  if (isRotated) {
    setRotatedTitleStyle(rightAxis, title, rightMaxWidth, bottomAxisHeight, topTitle);
  } else {
    setTitleStyle(axisInstance, title, shapeWidth, bottomAxisHeight);
  }
};

const setTooltip = (axisInstance) => {
  let allTick = axisInstance.selectAll('.tick');
  allTick.append('title')
    .text(d => String(d).split('|~|')[0]);
};

const setLabelStyle = (axisInstance, label, bandwidth, isRotated) => {
  let { style } = label;
  let allLabel = axisInstance.selectAll('text');
  // 计算单元宽度能显示的文字个数
  allLabel.attr('font-size', style.fontSize) // 标签文本大小
    .attr('fill', style.fontColor) // 标签文本颜色
    .attr('opacity', style.opacity) // 标签文本透明度
    .attr('transform', `rotate(${style.rotate})`)
    .text(function (d) {
      let txt = String(d).split('|~|')[0];
      if (isRotated) {
        if (style.rotate !== 0) {
          return setTxt(bandwidth, txt, style.fontSize);
        }
      } else {
        if (style.rotate !== 90) {
          return setTxt(bandwidth, txt, style.fontSize);
        }
      }
      return setHTxt(bandwidth, txt, style.fontSize);
    });
  if (isRotated) {
    allLabel.attr('y', `${style.rotate === 90 ? 8 : 0}`)
      .attr('text-anchor', () => {
        const anchorObj = {
          45: 'end',
          '-45': 'end',
          90: 'middle',
          0: 'end'
        };
        return anchorObj[style.rotate];
      });
  } else {
    allLabel.attr('x', () => {
      return `${style.rotate === 90 ? 5 : 0}`;
    })
      .attr('y', `${style.rotate === 90 ? -5 : 5}`)
      .attr('text-anchor', () => {
        const anchorObj = {
          45: 'start',
          '-45': 'end',
          90: 'start',
          0: 'middle'
        };
        return anchorObj[style.rotate];
      });
  }
};

const setTitleStyle = (axisInstance, title, shapeWidth, bottomAxisHeight) => {
  let { style, show, value } = title;
  axisInstance.append('g')
    .append('text')
    .attr('text-anchor', 'end')
    .attr('transform', () => {
      let transform = `translate(${shapeWidth - 8},${bottomAxisHeight - 20})`;
      return transform;
    }) // 预留8px的边距
    .attr('fill', style.fontColor)
    .attr('font-size', style.fontSize)
    .attr('opacity', show ? 1 : 0)
    .text(value);
};

const setRotatedTitleStyle = (axisInstance, title, rightMaxWidth, bottomAxisHeight, topTitle) => {
  let { style, show } = title;
  let titleLen = getTxtWidth(topTitle, style.fontSize);
  let width = bottomAxisHeight - 30;
  if (width < titleLen) width = titleLen + 10;
  axisInstance.append('g')
    .append('text')
    .attr('text-anchor', 'end')
    .attr('transform', () => {
      let transform = `translate(${width},${rightMaxWidth - 30})`;
      return transform;
    }) // 预留8px的边距
    .attr('fill', style.fontColor)
    .attr('font-size', style.fontSize)
    .attr('opacity', show ? 1 : 0)
    .text(topTitle);
};

export {
  createBottomAxis,
  setBottomAxisStyle,
  setRotatedTitleStyle
};
