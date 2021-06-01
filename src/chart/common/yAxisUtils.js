import { setLineStyle } from './axisUtil';
import { getTxtWidth } from './containerUtils';
import { setTxt } from './utils';
const createYAxis = (axisContainer, axis, height, width) => {
  let axisInstance = axisContainer.append('g')
    .attr('transform', () => {
      return `translate(${width || 0},${height})`;
    })
    .call(axis);
  return axisInstance;
};

const createRotatedYAxis = (axisContainer, axis, height, translateY, id) => {
  let axisInstance = axisContainer.append('g')
    .attr('class', `axis-${id}`)
    .attr('transform', () => {
      return `translate(${height},${translateY})`;
    })
    .call(axis);
  return axisInstance;
};

const setYAxisStyle = (axisInstance, yAxisChild, width, leftLabelWidth, titleWidth, shapeWidth, format, labelWidth, start, isRotated, isLast, yAxisHeight, isCombined) => {
  let { line, label, title, position } = yAxisChild;
  setLineStyle(axisInstance, line);
  // 设置标签的样式
  setLabelStyle(axisInstance, label, position, format, start, isRotated, isLast, yAxisHeight, isCombined);
  filterLabel(axisInstance, yAxisHeight, label, isRotated, start);
  // 设置标题
  setTitleStyle(axisInstance, title, position, width, shapeWidth, isRotated, yAxisHeight, leftLabelWidth, titleWidth, start, labelWidth);
};

const filterLabel = (axisInstance, yAxisHeight, label, isRotated) => {
  let dom = axisInstance._groups[0][0].querySelectorAll('.axis-label');
  dom = [...dom];
  let len = dom.length;
  let bandwidth = yAxisHeight / (len + 2);
  let txtArr = [];
  for (let i = 0; i < len; i++) {
    let txtLen = getTxtWidth(dom[i].textContent, label.style.fontSize || 14);
    txtArr.push(txtLen);
  }
  let txt = Math.max(...txtArr);
  let num = 1;
  if (bandwidth < txt) {
    num = Math.ceil(txt / bandwidth);
  }
  for (let i = 0; i < len; i++) {
    if (i % num) {
      dom[i].style.display = 'none';
    } else {
      if (i === len - 1 && isRotated) {
        dom[i].style.display = 'none';
      }
    }
  }
  // debugger;
  // if (bandwidth < 15) {
  //   dom[len - 1].style.display = 'none';
  //   dom[0].style.display = 'none';
  // }
};

const setLabelStyle = (axisInstance, label, position, format, start, isRotated, isLast, yAxisHeight, isCombined) => {
  let { style } = label;
  let allLabel = axisInstance.selectAll('text');
  let txtNum = allLabel._groups[0].length - 1;
  // let perTxt = null;
  // 计算单元宽度能显示的文字个数
  allLabel.attr('font-size', style.fontSize) // 标签文本大小
    .attr('fill', style.fontColor) // 标签文本颜色
    .attr('opacity', style.opacity) // 标签文本透明度
    .attr('transform', `rotate(${style.rotate})`)
    .attr('class', () => {
      return 'axis-label';
    })
    .text(function (d, index) {
      if (d === 0) return d;
      let txt = (txtNum === index && start !== 0) ? '' : format(d);
      if (isRotated) {
        if (index === 0) return format(d);
        if (txtNum === index && !isLast) return '';
        if (txtNum === index && isLast) return format(d);
        return format(d);
      }
      if (yAxisHeight < 15 && index === 0) {
        txt = '';
      };
      return txt;
    });
  if (isRotated) {
    allLabel.attr('x', (d) => {
      let obj = {
        45: 25,
        '-45': 0,
        90: 0,
        0: 0
      };
      if (position === 'right') {
        obj = {
          0: 5,
          90: 5,
          45: 5,
          '-45': 5
        };
      }
      return `${obj[style.rotate] || 0}`;
    })
      .attr('text-anchor', () => {
        let anchorObj = {
          45: 'end',
          '-45': 'start',
          90: 'end',
          0: 'middle'
        };
        if (position === 'right') {
          anchorObj = {
            0: 'middle',
            90: 'start',
            45: 'start',
            '-45': 'end'
          };
        }
        return anchorObj[style.rotate];
      })
      .attr('y', () => {
        let yObj = {
          45: -35,
          '-45': 3,
          90: -3,
          0: -3
        };
        if (position === 'right') {
          yObj = {
            0: 3,
            90: 3,
            45: 3,
            '-45': 5
          };
        }
        return yObj[style.rotate];
      });
  } else {
    allLabel.attr('x', (d) => {
      let obj = {
        45: -10,
        '-45': -5,
        90: 0,
        0: -5
      };
      if (position === 'right') {
        obj = {
          0: 0,
          90: -5,
          45: 10,
          '-45': 10
        };
      }
      return `${obj[style.rotate] || 10}`;
    });
    allLabel.attr('y', (d) => {
      let obj = {
        45: 0,
        90: 10,
        '-45': -5
      };
      if (position === 'right') {
        obj = {
          45: 0,
          '-45': 0,
          90: -15,
          0: 0
        };
      }
      return `${obj[style.rotate] || 0}`;
    })
      .attr('text-anchor', () => {
        let anchorObj = {
          45: 'end',
          '-45': 'end',
          90: 'middle',
          0: 'end'
        };
        if (position === 'right') {
          anchorObj = {
            45: 'start',
            '-45': 'start',
            90: 'middle',
            0: 'start'
          };
        }
        return anchorObj[style.rotate];
      });
  }
};

const setTitleStyle = (axisInstance, title, position, width, shapeHeight, isRotated, yAxisHeight, leftLabelWidth, titleWidth, start, labelWidth) => {
  let { style, show, value } = title;
  axisInstance.append('g')
    .attr('transform', () => {
      let translateX = leftLabelWidth + titleWidth;
      let translateY = start === 0 ? -4 : 4;
      if (isRotated) {
        translateX = -yAxisHeight;
        translateY = width - 10;
        if (position === 'left') {
          translateY = -labelWidth - 6;
        }
      } else {
        if (position === 'right') {
          translateX = -width + titleWidth - 5;
        }
      }
      return `translate(${-translateX}, ${translateY})`;
    })
    .append('text')
    .attr('text-anchor', isRotated ? 'end' : 'start')
    .attr('font-size', style.fontSize) // 标题大小
    .attr('fill', style.fontColor) // 标题颜色
    .attr('opacity', show ? 1 : 0)
    .style('writing-mode', isRotated ? 'lr-tb' : 'tb')
    .text(() => {
      return setTxt(yAxisHeight, value, style.fontSize);
    }) // 标题名称
    .append('title')
    .text(value);
};

const createYGrid = (middle, axis, position, topAxisHeight, shapeWidth, yAxisChild) => {
  if (position !== 'left') return;
  if (!yAxisChild.grid) return;
  let { show, style } = yAxisChild.grid.line;
  if (!show) return;
  let axisInstance = middle.append('g')
    .attr('transform', () => {
      return `translate(${0},${topAxisHeight})`;
    })
    .call(axis);
  axisInstance.selectAll('text').attr('opacity', 0);
  axisInstance.selectAll('path').attr('opacity', 0);
  let allTick = axisInstance.selectAll('line');
  allTick.attr('x2', shapeWidth)
    .attr('stroke-dasharray', style.lineDash.join(','))
    .attr('stroke', style.fontColor)
    .attr('stroke-width', style.lineWidth);
};

const createRotatedYGrid = (middle, axis, position, bottomAxisHeight, shapeWidth, yAxisChild) => {
  if (position !== 'left') return;
  if (!yAxisChild.grid) return;
  let { show, style } = yAxisChild.grid.line;
  if (!show) return;
  let axisInstance = middle.append('g')
    .attr('transform', () => {
      return `translate(${bottomAxisHeight},${0})`;
    })
    .call(axis);
  axisInstance.selectAll('text').attr('opacity', 0);
  axisInstance.selectAll('path').attr('opacity', 0);
  let allTick = axisInstance.selectAll('line');
  allTick.attr('y2', shapeWidth)
    .attr('stroke-dasharray', style.lineDash.join(','))
    .attr('stroke', style.fontColor)
    .attr('stroke-width', style.lineWidth);
};

export {
  createYGrid,
  createYAxis,
  setYAxisStyle,
  createRotatedYAxis,
  createRotatedYGrid,
  setLabelStyle
};
