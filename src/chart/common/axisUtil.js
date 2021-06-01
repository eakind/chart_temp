import { setTickValues } from './utils';
const initAxis = (scale, position, height, tickNum, isRotated) => {
  let scaleObj = {
    top: d3.axisTop(scale),
    bottom: d3.axisBottom(scale),
    left: d3.axisLeft(scale),
    right: d3.axisRight(scale)
  };
  if (isRotated) {
    scaleObj = {
      left: d3.axisTop(scale),
      right: d3.axisBottom(scale),
      bottom: d3.axisLeft(scale),
      top: d3.axisRight(scale)
    };
  }
  let axis = scaleObj[position]
    .tickPadding(6);
    // .tickSizeInner(0)
    // .tickSizeOuter(0);
  if (position === 'left' || position === 'right') {
    if (!tickNum) return axis;
    // if (height / tickNum > 10) {
    let arr = setTickValues(scale.domain(), tickNum);
    axis.tickValues(arr);
    // };
  }
  return axis;
};

// const setTick = (axis, domain, height) => {
//   let arr = [];
//   let count = Math.ceil(height / 50);
//   let total = domain[1] - domain[0];
//   if (!count) {
//     arr = JSON.parse(JSON.stringify(domain));
//     for (let i = 0; i < count; i++) {
//       arr.push();
//     }
//     axis.tickValues(arr);
//     return axis;
//   }
//   let gap = total / count;
//   for (let i = 0; i <= count; i++) {
//     arr.push(i * gap);
//   }
//   axis.tickValues(arr);
//   return axis;
// };

const setLineStyle = (axisInstance, line) => {
  let { style, show } = line;
  show ? style.opacity = 1 : style.opacity = 0;
  axisInstance.select('path')
    .attr('stroke-dasharray', style.lineDash.join(',')) // 虚实线
    .attr('stroke', style.fontColor) // 坐标轴线颜色
    .attr('stroke-width', style.lineWidth) // 坐标轴线宽度
    .attr('opacity', style.opacity); // 坐标轴线透明度
  axisInstance.selectAll('line')
    .attr('stroke', style.fontColor);
};

export {
  initAxis,
  setLineStyle
};
